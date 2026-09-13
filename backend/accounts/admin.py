from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'is_staff', 'created_at')
    ordering = ('-created_at',)
    fieldsets = UserAdmin.fieldsets + (
        ('RPG Profile', {'fields': ('avatar', 'title', 'bio')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('RPG Profile', {'fields': ('email', 'avatar')}),
    )
