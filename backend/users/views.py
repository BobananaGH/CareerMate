from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# ---- Login endpoint ----
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


# ---- Protected endpoint example ----
class ProtectedView(APIView):
    # Force JWT only, ignore Basic Auth
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": f"Hello {request.user.email}, you are authenticated!"
        })
        
# ---- Me endpoint to get current user info ----
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
        })


