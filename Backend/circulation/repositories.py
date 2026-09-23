# circulation/repositories.py

from datetime import date
from .models import Transaction
from library.models import Book


class CirculationRepository:
    def get_all(self):
        return Transaction.objects.select_related('member', 'book').all()

    def get_by_id(self, transaction_id):
        return Transaction.objects.filter(transaction_id=transaction_id).first()

    def borrow_book(self, data: dict) -> Transaction:
        book = data['book']
        book.available_quantity -= 1
        book.save()
        return Transaction.objects.create(**data)

    def return_book(self, transaction: Transaction) -> Transaction:
        transaction.return_date = date.today()
        transaction.status = 'returned'

        # Calculate fine — $1 per day overdue
        if transaction.return_date > transaction.due_date:
            overdue_days = (transaction.return_date - transaction.due_date).days
            transaction.fine_amount = overdue_days * 1.00

        # Restore available quantity
        transaction.book.available_quantity += 1
        transaction.book.save()
        transaction.save()
        return transaction