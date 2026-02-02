from urllib.parse import quote, unquote

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated 
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

from .serializers import LoginSerializer

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
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
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
            first_name = idinfo.get("given_name", "")
            last_name = idinfo.get("family_name", "")
            # Get or create user
            user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": first_name,
                "last_name": last_name,
                "role": "candidate",
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
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                },

                "tokens": {
                    "access": access_token,
                    "refresh": refresh_token,
                }
            }, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

# ===================== Register =====================
class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data

        email = data.get("email")
        password = data.get("password")
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")
        role = data.get("role", "candidate")

        if not email or not password:
            return Response({"error": "Email and password required"}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=role,
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
            },
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        }, status=201)


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
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        })

    def patch(self, request):
        user = request.user

        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        email = request.data.get("email")

        # prevent duplicate emails
        if email and User.objects.exclude(id=user.id).filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        if first_name is not None:
            user.first_name = first_name

        if last_name is not None:
            user.last_name = last_name

        if email is not None:
            user.email = email
            user.username = email

        user.save()

        return Response({
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
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
    
# ===================== Get Admin Users =====================
class AdminUsersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(status=403)

        users = User.objects.all().values(
            "id",
            "email",
            "is_staff",
            "date_joined"
        )

        return Response(users)

 