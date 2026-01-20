from django.contrib import admin
from .models import Conversation, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ("role", "content", "created_at")
    can_delete = False


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "title",
        "created_at",
        "updated_at",
    )
    list_filter = ("created_at", "updated_at")
    search_fields = ("title", "user__email")
    ordering = ("-updated_at",)
    readonly_fields = ("created_at", "updated_at")

    inlines = [MessageInline]

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "conversation",
        "role",
        "created_at",
    )
    list_filter = ("role", "created_at")
    search_fields = ("content",)
    ordering = ("created_at",)
    readonly_fields = (
        "conversation",
        "role",
        "content",
        "created_at",
    )

    def has_delete_permission(self, request, obj=None):
        return False
