# library/services.py

from .repositories import BookRepository, CategoryRepository


class CategoryService:
    def __init__(self):
        self.repo = CategoryRepository()

    def get_all(self):
        return self.repo.get_all()

    def get_one(self, category_id):
        return self.repo.get_by_id(category_id)

    def create(self, data: dict):
        return self.repo.create(data)

    def update(self, category_id, data: dict):
        category = self.repo.get_by_id(category_id)
        if not category:
            return None
        return self.repo.update(category, data)

    def delete(self, category_id):
        category = self.repo.get_by_id(category_id)
        if not category:
            return False
        self.repo.delete(category)
        return True


class BookService:
    def __init__(self):
        self.repo = BookRepository()

    def get_all(self):
        return self.repo.get_all()

    def get_one(self, book_id):
        return self.repo.get_by_id(book_id)

    def create(self, data: dict):
        return self.repo.create(data)

    def update(self, book_id, data: dict):
        book = self.repo.get_by_id(book_id)
        if not book:
            return None
        return self.repo.update(book, data)

    def delete(self, book_id):
        book = self.repo.get_by_id(book_id)
        if not book:
            return False
        self.repo.soft_delete(book)
        return True