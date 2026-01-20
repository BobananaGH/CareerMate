# monitoring/urls.py
from django.urls import path
from .views import AdminCVListAPIView, AdminConversationListAPIView

urlpatterns = [
    path("conversations/", AdminConversationListAPIView.as_view()),
    path("cvs/", AdminCVListAPIView.as_view()),
]
