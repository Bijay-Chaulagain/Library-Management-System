# circulation/admin.py

from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'member', 'book', 'borrow_date', 'due_date', 'status', 'fine_amount')
    list_filter = ('status',)
    search_fields = ('member__first_name', 'book__title')