# account/views.py

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    LoginSerializer, RegisterSerializer,
    UpdateUserSerializer, UserSerializer
)
from .services import UserService


class RegisterView(APIView):
    """POST /account/register/ — create a new user"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = UserService()
        user, tokens = service.register(serializer.validated_data)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """POST /account/login/ — authenticate and get tokens"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = UserService()
        user, tokens = service.login(
            serializer.validated_data['username'],
            serializer.validated_data['password'],
        )

        if not user:
            return Response(
                {'detail': 'Invalid username or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens,
        }, status=status.HTTP_200_OK)


class UserListView(APIView):
    """GET /account/users/ — list all active users (admin only)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        service = UserService()
        users = service.get_all_users()
        return Response(UserSerializer(users, many=True).data)


class UserDetailView(APIView):
    """GET/PATCH/DELETE /account/users/<user_id>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        service = UserService()
        user = service.get_user(user_id)
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(UserSerializer(user).data)

    def patch(self, request, user_id):
        serializer = UpdateUserSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        service = UserService()
        user = service.update_user(user_id, serializer.validated_data)
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(UserSerializer(user).data)

    def delete(self, request, user_id):
        service = UserService()
        deleted = service.delete_user(user_id)
        if not deleted:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'User deactivated successfully.'}, status=status.HTTP_200_OK)


class MeView(APIView):
    """GET /account/me/ — returns the currently logged-in user"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)