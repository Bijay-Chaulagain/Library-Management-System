# members/admin.py

from django.contrib import admin
from .models import Member


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('membership_no', 'first_name', 'last_name', 'email', 'is_active', 'join_date')
    list_filter = ('is_active',)
    search_fields = ('first_name', 'last_name', 'membership_no', 'email')