# monitoring/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from chat.models import Conversation
from resumes.models import CV
from articles.models import Article

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

class AdminArticleListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUserCustom]

    def get(self, request):
        articles = Article.objects.order_by("-created_at")[:50]

        from .serializers import ArticleAdminSerializer
        return Response(ArticleAdminSerializer(articles, many=True).data)

    def delete(self, request):
        article_id = request.data.get("id")

        if not article_id:
            return Response({"error": "Article id required"}, status=400)

        Article.objects.filter(id=article_id).delete()

        articles = Article.objects.order_by("-created_at")[:50]
        from .serializers import ArticleAdminSerializer

        return Response(ArticleAdminSerializer(articles, many=True).data)
