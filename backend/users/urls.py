from django.urls import path
from .views import LoginAPIView, ProtectedView, MeView, GoogleLoginAPIView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("google-login/", GoogleLoginAPIView.as_view(), name="google-login"),
    path("protected/", ProtectedView.as_view(), name="protected"),  
    path("me/", MeView.as_view(), name="me"),
    
]
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns += [
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
