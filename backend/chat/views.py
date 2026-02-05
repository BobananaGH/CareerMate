# chat/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from .models import Conversation, Message
from .serializers import SendMessageSerializer, MessageSerializer, ConversationSerializer
from backend_project.services.claude_service import career_chat_with_context, generate_roadmap


class SendMessageAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        print("RAW BODY:", request.data)
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
        
        history = conversation.messages.all().order_by("created_at")

        claude_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in history
            if msg.role in ["user", "assistant"]
        ]
        
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
    authentication_classes = [JWTAuthentication]
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
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
            user=request.user
        )

        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)

class RoadmapAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cv_text = request.data.get("cv_text")

        if not cv_text:
            return Response({"error": "cv_text required"}, status=400)

        try:
            roadmap = generate_roadmap(cv_text)
        except Exception as e:
            return Response(
                {"error": "AI service failed"},
                status=500
            )

        return Response({"roadmap": roadmap})
