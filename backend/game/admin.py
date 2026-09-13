from django.contrib import admin
from .models import Character, Task, TaskCompletion, Badge, UserBadge, HistoryEntry, XPTransaction, GoldTransaction


@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = ('user', 'level', 'total_xp', 'gold', 'current_streak')
    search_fields = ('user__username', 'user__email')


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'difficulty', 'status', 'created_at')
    list_filter = ('status', 'category', 'difficulty')
    search_fields = ('title', 'user__username')


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'rarity', 'requirement_type', 'requirement_value')


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'unlocked_at')


admin.site.register(TaskCompletion)
admin.site.register(HistoryEntry)
admin.site.register(XPTransaction)
admin.site.register(GoldTransaction)
