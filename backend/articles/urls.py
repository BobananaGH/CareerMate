from django.urls import path
from .views import ArticleListAPIView, ArticleCreateAPIView

urlpatterns = [
    path("", ArticleListAPIView.as_view()),
    path("create/", ArticleCreateAPIView.as_view()),
]
