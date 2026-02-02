from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.shortcuts import get_object_or_404

from .models import Article
from .serializers import ArticleSerializer

class ArticleListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        articles = Article.objects.all().order_by("-created_at")
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)


class ArticleCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ArticleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class ArticleDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        serializer = ArticleSerializer(article)
        return Response(serializer.data)