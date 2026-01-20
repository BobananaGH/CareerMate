from django.urls import path
from .views import AdminConversationListAPIView

urlpatterns = [
    path("conversations/", AdminConversationListAPIView.as_view()),
]
