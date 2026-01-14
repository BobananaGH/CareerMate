from django.urls import path
from .views import (
    LoginAPIView,
    ProtectedView,
    MeView,
    GoogleLoginAPIView,
    PasswordResetRequestAPIView,
    PasswordResetConfirmAPIView,
    PasswordResetCompleteAPIView,
    CVAnalyzeAPIView
)
from rest_framework_simplejwt.views import TokenRefreshView

# users/urls.py
urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("google-login/", GoogleLoginAPIView.as_view(), name="google-login"),
    path("protected/", ProtectedView.as_view(), name="protected"),
    path("me/", MeView.as_view(), name="me"),

    path("password-reset/", PasswordResetRequestAPIView.as_view()),
    path("password-reset/confirm/", PasswordResetConfirmAPIView.as_view()),  
    path("password-reset/complete/", PasswordResetCompleteAPIView.as_view()),
    path("analyze/", CVAnalyzeAPIView.as_view(), name="cv-analyze"),
]
