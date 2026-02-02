from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    author_email = serializers.EmailField(source="author.email", read_only=True)
    author_username = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "content",
            "created_at",
            "author",
            "author_email",
            "author_username",
        ]
        read_only_fields = ["author"]
