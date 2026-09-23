# circulation/urls.py

from django.urls import path
from .views import ReturnBookView, TransactionListView

urlpatterns = [
    path('', TransactionListView.as_view(), name='transaction-list'),
    path('<uuid:transaction_id>/return/', ReturnBookView.as_view(), name='return-book'),
]