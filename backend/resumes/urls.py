# resumes/urls.py
from django.urls import path
from .views import CVAnalyzeAPIView

urlpatterns = [
    path("analyze/", CVAnalyzeAPIView.as_view(), name="cv-analyze"),
]
