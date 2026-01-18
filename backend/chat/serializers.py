from rest_framework import serializers
from .models import Conversation, Message


class SendMessageSerializer(serializers.Serializer):
    """
    Input serializer for sending a chat message
    """
    conversation_id = serializers.IntegerField(required=False, allow_null=True)
    message = serializers.CharField(max_length=2000)


class MessageSerializer(serializers.ModelSerializer):
    """
    Output serializer for a single message
    """
    class Meta:
        model = Message
        fields = [
            "id",
            "role",
            "content",
            "created_at",
        ]


class ConversationSerializer(serializers.ModelSerializer):
    """
    Output serializer for a conversation with full message history
    """
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = [
            "id",
            "title",
            "created_at",
            "messages",
        ]
