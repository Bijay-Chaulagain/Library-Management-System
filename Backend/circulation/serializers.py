# circulation/serializers.py

from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    member_name = serializers.SerializerMethodField()
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'transaction_id', 'member', 'member_name', 'book', 'book_title',
            'borrow_date', 'due_date', 'return_date', 'status', 'fine_amount'
        ]
        read_only_fields = ['transaction_id', 'borrow_date', 'status', 'fine_amount']

    def get_member_name(self, obj):
        return f'{obj.member.first_name} {obj.member.last_name}'