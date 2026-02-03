from rest_framework import serializers
from .models import Job, Application


class JobSerializer(serializers.ModelSerializer):
    recruiter_email = serializers.EmailField(source="recruiter.email", read_only=True)
    applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "description",
            "skills",
            "location",
            "created_at",
            "recruiter_email",
            "applied",
        ]

    def get_applied(self, obj):
        request = self.context.get("request")

        if not request or request.user.is_anonymous:
            return False

        return Application.objects.filter(
            job=obj,
            candidate=request.user
        ).exists()



class ApplicationSerializer(serializers.ModelSerializer):
    candidate_email = serializers.EmailField(source="candidate.email", read_only=True)

    class Meta:
        model = Application
        read_only_fields = ["job", "created_at", "candidate", "cv"]
        fields = [
            "id",
            "job",
            "candidate_email",
            "cv",
            "status",
            "created_at",
        ]

    def validate(self, data):
        request = self.context["request"]
        user = request.user
        job_id = request.data.get("job")

        if request.method == "POST":

            if not job_id:
                raise serializers.ValidationError("Job is required.")

            try:
                job = Job.objects.get(id=job_id)
            except Job.DoesNotExist:
                raise serializers.ValidationError("Invalid job.")

            if Application.objects.filter(job=job, candidate=user).exists():
                raise serializers.ValidationError("Already applied.")

            data["job"] = job

        return data

