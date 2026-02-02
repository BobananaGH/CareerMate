from django.urls import path
from .views import ApplicationStatusUpdateView, JobListCreateView, ApplyJobView, RecruiterApplicationsView, MyApplicationsView, JobDetailView

urlpatterns = [
    path("", JobListCreateView.as_view()),
    path("<int:pk>/", JobDetailView.as_view()),     
    path("apply/", ApplyJobView.as_view()),
    path("applications/", RecruiterApplicationsView.as_view()),
    path("applications/<int:pk>/", ApplicationStatusUpdateView.as_view()),
    path("my-applications/", MyApplicationsView.as_view()),
]

