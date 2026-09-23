# members/serializers.py

from rest_framework import serializers
from .models import Member


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            'member_id', 'membership_no', 'first_name', 'last_name',
            'email', 'phone', 'is_active', 'join_date'
        ]
        read_only_fields = ['member_id', 'join_date']

    def validate_membership_no(self, value):
        # On update, exclude the current instance from uniqueness check
        instance = self.instance
        qs = Member.objects.filter(membership_no=value)
        if instance:
            qs = qs.exclude(member_id=instance.member_id)
        if qs.exists():
            raise serializers.ValidationError('This membership number is already taken.')
        return value