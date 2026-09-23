# library/urls.py

from django.urls import path
from .views import BookDetailView, BookListView, CategoryDetailView, CategoryListView

urlpatterns = [
    # Categories
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<uuid:category_id>/', CategoryDetailView.as_view(), name='category-detail'),
    # Books
    path('books/', BookListView.as_view(), name='book-list'),
    path('books/<uuid:book_id>/', BookDetailView.as_view(), name='book-detail'),
]