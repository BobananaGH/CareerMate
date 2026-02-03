from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView
from django.shortcuts import get_object_or_404

from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from .permissions import IsRecruiter, IsCandidate


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsRecruiter()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(
            recruiter=self.request.user,
            is_active=True,
            is_approved=True,
    )
        
    def get_queryset(self):
        return Job.objects.all().order_by("-created_at")
    
    def get_serializer_context(self):
        return {"request": self.request}

class JobDetailView(generics.RetrieveAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    queryset = Job.objects.all()
    
    def get_serializer_context(self):
        return {"request": self.request}

class ApplyJobView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsCandidate]

    def perform_create(self, serializer):
        job = serializer.validated_data["job"]

        if Application.objects.filter(candidate=self.request.user, job=job).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Already applied")

        serializer.save(candidate=self.request.user)


class RecruiterApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_queryset(self):
        return Application.objects.filter(
            job__recruiter=self.request.user
        ).select_related("job", "candidate")


class ApplicationStatusUpdateView(UpdateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    queryset = Application.objects.all()

    def get_object(self):
        app = get_object_or_404(Application, pk=self.kwargs["pk"])

        if app.job.recruiter != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Not your job")

        return app
    
class MyApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsCandidate]

    def get_queryset(self):
        return Application.objects.filter(
            candidate=self.request.user
        ).select_related("job")

