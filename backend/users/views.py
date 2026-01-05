from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import LoginSerializer  
from google.oauth2 import id_token
from google.auth.transport import requests

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
