# members/services.py

from .repositories import MemberRepository


class MemberService:
    def __init__(self):
        self.repo = MemberRepository()

    def get_all(self):
        return self.repo.get_all()

    def get_one(self, member_id):
        return self.repo.get_by_id(member_id)

    def create(self, data: dict):
        return self.repo.create(data)

    def update(self, member_id, data: dict):
        member = self.repo.get_by_id(member_id)
        if not member:
            return None
        return self.repo.update(member, data)

    def delete(self, member_id):
        member = self.repo.get_by_id(member_id)
        if not member:
            return False
        self.repo.soft_delete(member)
        return True