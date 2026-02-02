# monitoring/urls.py
from django.urls import path
from .views import AdminCVListAPIView, AdminConversationListAPIView, AdminArticleListAPIView 

urlpatterns = [
    path("conversations/", AdminConversationListAPIView.as_view()),
    path("cvs/", AdminCVListAPIView.as_view()),
    path("articles/", AdminArticleListAPIView.as_view()),
]
