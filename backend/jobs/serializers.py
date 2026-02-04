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
        print("USER:", request.user) 
        if not request or request.user.is_anonymous:
            return False

        return Application.objects.filter(
            job=obj,
            candidate=request.user
        ).exists()


class ApplicationSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(),
        write_only=True
    )

    candidate_email = serializers.EmailField(source="candidate.email", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    job_location = serializers.CharField(source="job.location", read_only=True)
    job_id = serializers.IntegerField(source="job.id", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "job",          
            "job_id",     
            "job_title",
            "job_location",
            "candidate_email",
            "cv",      
            "status",
            "created_at",
        ]
        read_only_fields = ["created_at", "candidate"]

        extra_kwargs = {
            "cv": {"required": False, "allow_null": True},
        }

    def validate(self, data):
        request = self.context["request"]
        user = request.user
        job = data.get("job")

        if Application.objects.filter(job=job, candidate=user).exists():
            raise serializers.ValidationError("Already applied.")

        return data


