# members/views.py

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MemberSerializer
from .services import MemberService


class MemberListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        service = MemberService()
        members = service.get_all()
        return Response(MemberSerializer(members, many=True).data)

    def post(self, request):
        serializer = MemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = MemberService()
        member = service.create(serializer.validated_data)
        return Response(MemberSerializer(member).data, status=status.HTTP_201_CREATED)


class MemberDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, member_id):
        service = MemberService()
        member = service.get_one(member_id)
        if not member:
            return Response({'detail': 'Member not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(MemberSerializer(member).data)

    def patch(self, request, member_id):
        member = MemberService().get_one(member_id)
        if not member:
            return Response({'detail': 'Member not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MemberSerializer(member, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = MemberService().update(member_id, serializer.validated_data)
        return Response(MemberSerializer(updated).data)

    def delete(self, request, member_id):
        deleted = MemberService().delete(member_id)
        if not deleted:
            return Response({'detail': 'Member not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'Member deactivated.'}, status=status.HTTP_200_OK)