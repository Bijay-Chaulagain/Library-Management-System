# account/repositories.py

from django.contrib.auth import authenticate
from .models import User


class UserRepository:
    """Only layer that directly queries the User table."""

    def create(self, data: dict) -> User:
        return User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            role=data.get('role', 'member'),
        )

    def get_all(self):
        return User.objects.filter(is_active=True)

    def get_by_id(self, user_id):
        return User.objects.filter(user_id=user_id, is_active=True).first()

    def get_by_username(self, username):
        return User.objects.filter(username=username).first()

    def authenticate(self, username: str, password: str):
        return authenticate(username=username, password=password)

    def update(self, user: User, data: dict) -> User:
        for field, value in data.items():
            setattr(user, field, value)
        user.save()
        return user

    def soft_delete(self, user: User) -> None:
        user.is_active = False
        user.save()