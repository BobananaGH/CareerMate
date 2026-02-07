# monitoring/views.py

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from chat.models import Conversation
from resumes.models import CV
from articles.models import Article
from jobs.models import Job, Application
from jobs.serializers import JobSerializer

from .serializers import (
    ConversationAdminSerializer,
    CVAdminSerializer, ApplicationAdminSerializer
)
from .permissions import IsAdminUserCustom
from django.shortcuts import get_object_or_404

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
        articles = Article.objects.select_related("author").order_by("-created_at")[:50]

        from .serializers import ArticleAdminSerializer
        return Response(ArticleAdminSerializer(articles, many=True).data)

    def delete(self, request):
        article_id = request.data.get("id")

        if not article_id:
            return Response({"error": "Article id required"}, status=400)

        article = get_object_or_404(Article, id=article_id)
        article.is_active = False
        article.save()


        articles = Article.objects.select_related("author").order_by("-created_at")[:50]
        from .serializers import ArticleAdminSerializer

        return Response(ArticleAdminSerializer(articles, many=True).data)

class AdminJobListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUserCustom]

    def get(self, request):
        jobs = Job.objects.select_related("recruiter").order_by("-created_at")[:50]

        return Response(
            JobSerializer(
                jobs,
                many=True,
                context={"request": request}   
            ).data
        )


class AdminApplicationListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUserCustom]

    def get(self, request):
        applications = (
            Application.objects
            .select_related("job", "candidate")
            .order_by("-created_at")[:50]
        )
        return Response(ApplicationAdminSerializer(applications, many=True).data)


class AdminApplicationDetailAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUserCustom]

    def patch(self, request, pk):
        application = get_object_or_404(Application, pk=pk)

        new_status = request.data.get("status")

        if not new_status:
            return Response(
                {"error": "status required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        application.status = new_status
        application.save()

        return Response(
            ApplicationAdminSerializer(application).data,
            status=status.HTTP_200_OK,
        )
        
class AdminApproveArticleAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUserCustom]

    def patch(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        article.is_approved = True
        article.is_active = True

        article.save()
        return Response({"success": True})

class AdminApproveJobAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUserCustom]

    def patch(self, request, pk):
        job = get_object_or_404(Job, pk=pk)

        job.is_approved = True
        job.is_active = True
        job.save()

        return Response({"success": True})
