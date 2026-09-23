# members/repositories.py

from .models import Member


class MemberRepository:
    def get_all(self):
        return Member.objects.filter(is_active=True)

    def get_by_id(self, member_id):
        return Member.objects.filter(member_id=member_id, is_active=True).first()

    def create(self, data: dict) -> Member:
        return Member.objects.create(**data)

    def update(self, member: Member, data: dict) -> Member:
        for field, value in data.items():
            setattr(member, field, value)
        member.save()
        return member

    def soft_delete(self, member: Member) -> None:
        member.is_active = False
        member.save()