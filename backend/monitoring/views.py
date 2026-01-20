# monitoring/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from chat.models import Conversation
from resumes.models import CV

from .serializers import (
    ConversationAdminSerializer,
    CVAdminSerializer,
)
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
        return Response(
            ConversationAdminSerializer(conversations, many=True).data
        )


class AdminCVListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUserCustom]

    def get(self, request):
        cvs = (
            CV.objects
            .select_related("user")
            .order_by("-uploaded_at")[:50]
        )
        return Response(
            CVAdminSerializer(cvs, many=True).data
        )
