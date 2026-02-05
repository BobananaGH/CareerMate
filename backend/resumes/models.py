from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

class CV(models.Model):
    user = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="cvs"
    )

    file = models.FileField(upload_to="cvs/")
    extracted_text = models.TextField(blank=True, null=True)
    analysis = models.TextField(blank=True, null=True)
    roadmap = models.TextField(blank=True, null=True)


    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CV #{self.id} - {self.user or 'Anonymous'}"
