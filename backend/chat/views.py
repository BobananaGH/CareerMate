# chat/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from .models import Conversation, Message
from .serializers import SendMessageSerializer, MessageSerializer, ConversationSerializer
from backend_project.services.claude_service import career_chat_with_context


class SendMessageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_message = serializer.validated_data["message"]
        user = request.user

        # Get or create conversation
        conversation_id = serializer.validated_data.get("conversation_id")

        if conversation_id:
            conversation = get_object_or_404(
                Conversation,
                id=conversation_id,
                user=user
            )
        else:
            conversation = Conversation.objects.create(user=user)

        # Save user message
        Message.objects.create(
            conversation=conversation,
            role="user",
            content=user_message,
        )

        # ✅ Build context for Claude (NO system role here)
        history = conversation.messages.all().order_by("created_at")

        claude_messages = []
        for msg in history:
            claude_messages.append({
                "role": msg.role,       # "user" or "assistant"
                "content": msg.content
            })

        # Call Claude
        ai_reply = career_chat_with_context(claude_messages)

        # Save assistant reply
        assistant_message = Message.objects.create(
            conversation=conversation,
            role="assistant",
            content=ai_reply,
        )

        conversation.save(update_fields=["updated_at"])

        return Response(
            {
                "success": True,
                "conversation_id": conversation.id,
                "reply": ai_reply,
                "message": MessageSerializer(assistant_message).data,
            },
            status=status.HTTP_200_OK,
        )


class ConversationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversations = (
            Conversation.objects
            .filter(user=request.user)
            .order_by("-updated_at")
            
        )

        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)

class ConversationDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
            user=request.user
        )

        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)
