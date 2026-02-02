from django.urls import path
from .views import ArticleListAPIView, ArticleCreateAPIView, ArticleDetailAPIView

urlpatterns = [
    path("", ArticleListAPIView.as_view()),
    path("create/", ArticleCreateAPIView.as_view()),
    path("<int:pk>/", ArticleDetailAPIView.as_view()),
]
