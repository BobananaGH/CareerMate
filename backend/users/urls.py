from django.urls import path
from .views import LoginAPIView, ProtectedView, MeView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("protected/", ProtectedView.as_view(), name="protected"),  
    path("me/", MeView.as_view(), name="me"),
    
]
