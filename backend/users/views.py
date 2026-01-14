from urllib.parse import quote, unquote

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token
from google.auth.transport import requests

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import EmailMessage
from django.core.files.uploadedfile import UploadedFile

from .serializers import LoginSerializer
from backend_project.utils.cv_parser import extract_text
from backend_project.services.claude_service import analyze_cv


User = get_user_model()
GOOGLE_CLIENT_ID = "376149640618-t1s22d2otnf5t0qh9rd2hg996ularb28.apps.googleusercontent.com"

# ===================== Normal Login =====================
class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "email": user.email,
            },
            "tokens": {
                "access": access_token,
                "refresh": refresh_token,
            }
        }, status=status.HTTP_200_OK)

# ===================== Google Login =====================
class GoogleLoginAPIView(APIView):
    """
    Accepts a Google ID token from frontend,
    verifies it, and issues JWT access + refresh tokens.
    """
    def post(self, request):
        token = request.data.get("credential")
        if not token:
            return Response({"error": "No credential provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify token
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
            email = idinfo.get("email")
            full_name = idinfo.get("name", "")

            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email.split("@")[0],
                    "first_name": full_name.split(" ")[0] if full_name else "",
                    "last_name": " ".join(full_name.split(" ")[1:]) if full_name else "",
                    "role": "candidate",  # default role
                }
            )

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({
                "user": {
                    "id": user.id,
                    "email": user.email,
                },
                "tokens": {
                    "access": access_token,
                    "refresh": refresh_token,
                }
            }, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

# ===================== Protected Example =====================
class ProtectedView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": f"Hello {request.user.email}, you are authenticated!"
        })

# ===================== Current User =====================
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
        })
        
# ===================== Request Password Reset =====================
class PasswordResetRequestAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "If the email exists, a reset link was sent"}, status=200)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)

        # URL-encode both to prevent splitting in emails
        uid_enc = quote(uid)
        token_enc = quote(token)
        reset_link = f"http://localhost:3000/reset-password?uid={uid_enc}&token={token_enc}"

        # print("DEBUG: reset link:", reset_link)

        html_content = f"""
        <p>Click the link to reset your password:</p>
        <p><a href="{reset_link}">{reset_link}</a></p>
        """

        msg = EmailMessage(
            subject="Reset your password",
            body=html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )
        msg.content_subtype = "html"
        msg.send()

        return Response({"message": "Password reset email sent"}, status=200)
# ===================== Confirm Password Reset =====================
class PasswordResetConfirmAPIView(APIView):
    def get(self, request):
        uid = request.query_params.get("uid")
        token = request.query_params.get("token")

        if not uid or not token:
            return Response({"valid": False}, status=400)

        try:
            # URL-decode first
            uid = unquote(uid)
            token = unquote(token)

            uid = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"valid": False}, status=400)

        is_valid = PasswordResetTokenGenerator().check_token(user, token)
        return Response({"valid": is_valid})


# ===================== Complete Password Reset =====================
class PasswordResetCompleteAPIView(APIView):
    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not all([uid, token, new_password]):
            return Response({"error": "Missing data"}, status=400)

        try:
            from urllib.parse import unquote
            uid = force_str(urlsafe_base64_decode(unquote(uid)))
            token = unquote(token)
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"error": "Invalid user"}, status=400)

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=400)

        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({"error": e.messages}, status=400)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successful"}, status=200)

# ===================== CV Analyze =====================
class CVAnalyzeAPIView(APIView):
    permission_classes = [AllowAny]  # Allow any

    def post(self, request):
        file: UploadedFile = request.FILES.get("resume")
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cv_text = extract_text(file)
            analysis = analyze_cv(cv_text)

            return Response({
                "success": True,
                "analysis": analysis
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)