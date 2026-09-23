# library/serializers.py

from rest_framework import serializers
from .models import Book, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name', 'description', 'created_at']
        read_only_fields = ['category_id', 'created_at']


class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Book
        fields = [
            'book_id', 'title', 'ISBN', 'author', 'publisher',
            'category', 'category_name', 'quantity',
            'available_quantity', 'created_at'
        ]
        read_only_fields = ['book_id', 'created_at', 'category_name']

    def validate(self, data):
        # available_quantity can never exceed total quantity
        quantity = data.get('quantity', 0)
        available = data.get('available_quantity', quantity)
        if available > quantity:
            raise serializers.ValidationError(
                'Available quantity cannot exceed total quantity.'
            )
        return data