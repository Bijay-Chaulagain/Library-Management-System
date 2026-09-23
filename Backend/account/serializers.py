# account/serializers.py

from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Safe output serializer — never exposes password."""
    class Meta:
        model = User
        fields = ['user_id', 'username', 'email', 'role', 'is_active', 'created_at']
        read_only_fields = ['user_id', 'created_at']


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    role = serializers.ChoiceField(
        choices=['admin', 'librarian', 'member'],
        default='member'
    )

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('This username is already taken.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email is already registered.')
        return value


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class UpdateUserSerializer(serializers.ModelSerializer):
    """Used for PATCH /account/users/<id>/ — partial updates."""
    class Meta:
        model = User
        fields = ['email', 'role', 'is_active']