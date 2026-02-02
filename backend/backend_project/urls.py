from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),  # your existing login endpoint
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path("api/chat/", include("chat.urls")),
    path("api/resumes/", include("resumes.urls")),
    path("api/articles/", include("articles.urls")),
    path("api/jobs/", include("jobs.urls")),
    
    path("api/admin/monitoring/", include("monitoring.urls")),
]
