from django.urls import path
from .views import (
    AdminCVListAPIView,
    AdminConversationListAPIView,
    AdminArticleListAPIView,
    AdminApplicationListAPIView,
    AdminJobListAPIView,
)

urlpatterns = [
    path("conversations/", AdminConversationListAPIView.as_view()),
    path("cvs/", AdminCVListAPIView.as_view()),
    path("articles/", AdminArticleListAPIView.as_view()),
    path("applications/", AdminApplicationListAPIView.as_view()),
    path("jobs/", AdminJobListAPIView.as_view()),
]
