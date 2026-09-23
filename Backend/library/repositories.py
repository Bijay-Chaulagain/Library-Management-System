# library/repositories.py

from .models import Book, Category


class CategoryRepository:
    def get_all(self):
        return Category.objects.all()

    def get_by_id(self, category_id):
        return Category.objects.filter(category_id=category_id).first()

    def create(self, data: dict) -> Category:
        return Category.objects.create(**data)

    def update(self, category: Category, data: dict) -> Category:
        for field, value in data.items():
            setattr(category, field, value)
        category.save()
        return category

    def delete(self, category: Category) -> None:
        category.delete()


class BookRepository:
    def get_all(self):
        return Book.objects.filter(is_deleted=False).select_related('category')

    def get_by_id(self, book_id):
        return Book.objects.filter(book_id=book_id, is_deleted=False).first()

    def create(self, data: dict) -> Book:
        # Set available_quantity = quantity if not provided
        if 'available_quantity' not in data:
            data['available_quantity'] = data.get('quantity', 0)
        return Book.objects.create(**data)

    def update(self, book: Book, data: dict) -> Book:
        for field, value in data.items():
            setattr(book, field, value)
        book.save()
        return book

    def soft_delete(self, book: Book) -> None:
        book.is_deleted = True
        book.save()