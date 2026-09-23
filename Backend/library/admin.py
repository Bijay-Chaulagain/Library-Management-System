# library/admin.py

from django.contrib import admin
from .models import Book, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'ISBN', 'category', 'quantity', 'available_quantity', 'is_deleted')
    list_filter = ('category', 'is_deleted')
    search_fields = ('title', 'author', 'ISBN')