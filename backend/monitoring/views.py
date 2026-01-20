from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from chat.models import Conversation
from .serializers import ConversationAdminSerializer
from .permissions import IsAdminUserCustom

class AdminConversationListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUserCustom]

    def get(self, request):
        conversations = (
            Conversation.objects
            .select_related("user")
            .prefetch_related("messages")
            .order_by("-updated_at")[:50]
        )

        serializer = ConversationAdminSerializer(conversations, many=True)
        return Response(serializer.data)
