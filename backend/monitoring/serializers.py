from rest_framework import serializers
from resumes.models import CV
from chat.models import Conversation, Message

class MessageAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "role", "content", "created_at"]

class ConversationAdminSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    messages = MessageAdminSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "user_email", "created_at", "updated_at", "messages"]
class CVAdminSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(
        source="user.email",
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = CV
        fields = ["id", "user_email", "file", "uploaded_at"]