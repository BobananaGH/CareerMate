from django.urls import path
from .views import SendMessageAPIView, ConversationListAPIView, ConversationDetailAPIView

urlpatterns = [
    path("send/", SendMessageAPIView.as_view(), name="chat-send"),
    path("conversations/", ConversationListAPIView.as_view(), name="chat-list"),
    path("conversations/<int:conversation_id>/", ConversationDetailAPIView.as_view(), name="chat-detail"),
]
