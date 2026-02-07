from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import UpdateAPIView, DestroyAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from .permissions import IsRecruiter, IsCandidate


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsRecruiter()]
        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(
            recruiter=self.request.user,
            is_active=True,
            is_approved=False,
        )

        
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Job.objects.all().order_by("-created_at")

        return Job.objects.filter(
            is_active=True,
            is_approved=True
        ).order_by("-created_at")

    def get_serializer_context(self):
        return {"request": self.request}




class JobDetailView(generics.RetrieveAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Job.objects.all()

        return Job.objects.filter(is_active=True, is_approved=True)


    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class ApplyJobView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsCandidate]

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user)
        
class UnapplyJobView(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def get_object(self):
        job_id = self.kwargs["job_id"]

        application = get_object_or_404(
            Application,
            job_id=job_id,
            candidate=self.request.user
        )

        return application

class RecruiterApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_queryset(self):
        return Application.objects.filter(
            job__recruiter=self.request.user
        ).select_related("job", "candidate")
        
    def get_serializer_context(self):
        return {"request": self.request}


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
        
    def get_serializer_context(self):
        return {"request": self.request}
