# circulation/views.py

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from library.models import Book
from .serializers import TransactionSerializer
from .services import CirculationService


class TransactionListView(APIView):
    """GET all transactions / POST to borrow a book"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        service = CirculationService()
        transactions = service.get_all_transactions()
        return Response(TransactionSerializer(transactions, many=True).data)

    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        service = CirculationService()
        transaction, error = service.borrow(data)

        if error:
            return Response({'detail': error}, status=status.HTTP_400_BAD_REQUEST)

        return Response(TransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)


class ReturnBookView(APIView):
    """POST /circulation/<transaction_id>/return/ — return a borrowed book"""
    permission_classes = [IsAuthenticated]

    def post(self, request, transaction_id):
        service = CirculationService()
        transaction, error = service.return_book(transaction_id)

        if error:
            return Response({'detail': error}, status=status.HTTP_400_BAD_REQUEST)

        return Response(TransactionSerializer(transaction).data)