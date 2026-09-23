# account/services.py

from core.utils import generate_tokens_for_user
from .repositories import UserRepository


class UserService:
    """Business logic for all user operations."""

    def __init__(self):
        self.repo = UserRepository()

    def register(self, data: dict):
        user = self.repo.create(data)
        tokens = generate_tokens_for_user(user)
        return user, tokens

    def login(self, username: str, password: str):
        user = self.repo.authenticate(username, password)
        if not user:
            return None, None
        tokens = generate_tokens_for_user(user)
        return user, tokens

    def get_all_users(self):
        return self.repo.get_all()

    def get_user(self, user_id):
        return self.repo.get_by_id(user_id)

    def update_user(self, user_id, data: dict):
        user = self.repo.get_by_id(user_id)
        if not user:
            return None
        return self.repo.update(user, data)

    def delete_user(self, user_id):
        user = self.repo.get_by_id(user_id)
        if not user:
            return False
        self.repo.soft_delete(user)
        return True