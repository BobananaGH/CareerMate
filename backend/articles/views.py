from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.shortcuts import get_object_or_404

from .models import Article
from .serializers import ArticleSerializer

class ArticleListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated and request.user.is_staff:
            articles = Article.objects.select_related("author").order_by("-created_at")
        else:
            articles = Article.objects.select_related("author").filter(
                is_approved=True,
                is_active=True
            ).order_by("-created_at")

        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)


class ArticleCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ArticleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
        author=request.user,
        is_approved=False,
        is_active=True
    )

        return Response(serializer.data, status=201)

class ArticleDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):

        if request.user.is_authenticated and request.user.is_staff:
            article = get_object_or_404(Article, pk=pk)
        else:
            article = get_object_or_404(
                Article,
                pk=pk,
                is_approved=True,
                is_active=True
            )

        serializer = ArticleSerializer(article)
        return Response(serializer.data)
