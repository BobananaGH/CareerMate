from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from .models import CV
from backend_project.utils.cv_parser import extract_text
from backend_project.services.claude_service import analyze_cv


class CVAnalyzeAPIView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("resume")

        if not file:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user if request.user.is_authenticated else None

        cv = CV.objects.create(
            user=user,
            file=file
        )

        cv_text = extract_text(file)
        analysis = analyze_cv(cv_text)

        cv.extracted_text = cv_text
        cv.analysis = analysis
        cv.save(update_fields=["extracted_text", "analysis"])

        return Response({
            "success": True,
            "cv_id": cv.id,
            "anonymous": user is None,
            "analysis": analysis,
            "extracted_text": cv_text
        })

