# circulation/services.py

from .repositories import CirculationRepository


class CirculationService:
    def __init__(self):
        self.repo = CirculationRepository()

    def get_all_transactions(self):
        return self.repo.get_all()

    def borrow(self, data: dict):
        book = data.get('book')
        if not book or book.available_quantity < 1:
            return None, 'This book is not available for borrowing.'
        transaction = self.repo.borrow_book(data)
        return transaction, None

    def return_book(self, transaction_id):
        transaction = self.repo.get_by_id(transaction_id)
        if not transaction:
            return None, 'Transaction not found.'
        if transaction.status == 'returned':
            return None, 'This book has already been returned.'
        transaction = self.repo.return_book(transaction)
        return transaction, None