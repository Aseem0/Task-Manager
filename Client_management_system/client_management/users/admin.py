from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'role', 'is_staff', 'is_active']

    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'phone', 'company', 'department', 'address', 'notes', 'tags', 'avatar')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'phone', 'company', 'department', 'address', 'notes', 'tags', 'avatar')}),
    )

    # Allow searching/filtering by role
    search_fields = ['username', 'email', 'role']
    list_filter = ['role', 'is_staff', 'is_active', 'is_superuser']


