# library/views.py

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import BookSerializer, CategorySerializer
from .services import BookService, CategoryService


class CategoryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        service = CategoryService()
        data = service.get_all()
        return Response(CategorySerializer(data, many=True).data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = CategoryService()
        category = service.create(serializer.validated_data)
        return Response(CategorySerializer(category).data, status=status.HTTP_201_CREATED)


class CategoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, category_id):
        service = CategoryService()
        category = service.get_one(category_id)
        if not category:
            return Response({'detail': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(CategorySerializer(category).data)

    def patch(self, request, category_id):
        serializer = CategorySerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        service = CategoryService()
        category = service.update(category_id, serializer.validated_data)
        if not category:
            return Response({'detail': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(CategorySerializer(category).data)

    def delete(self, request, category_id):
        service = CategoryService()
        deleted = service.delete(category_id)
        if not deleted:
            return Response({'detail': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'Category deleted.'}, status=status.HTTP_200_OK)


class BookListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        service = BookService()
        books = service.get_all()
        return Response(BookSerializer(books, many=True).data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = BookService()
        book = service.create(serializer.validated_data)
        return Response(BookSerializer(book).data, status=status.HTTP_201_CREATED)


class BookDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, book_id):
        service = BookService()
        book = service.get_one(book_id)
        if not book:
            return Response({'detail': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(BookSerializer(book).data)

    def patch(self, request, book_id):
        serializer = BookSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        service = BookService()
        book = service.update(book_id, serializer.validated_data)
        if not book:
            return Response({'detail': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(BookSerializer(book).data)

    def delete(self, request, book_id):
        service = BookService()
        deleted = service.delete(book_id)
        if not deleted:
            return Response({'detail': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'Book deleted.'}, status=status.HTTP_200_OK)