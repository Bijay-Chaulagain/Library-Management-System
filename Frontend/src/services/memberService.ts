// src/services/memberService.ts

import axiosInstance from '../api/axiosInstance';
import { Member } from '../types';

type CreateMemberData = Omit<Member, 'member_id' | 'join_date'>;

export const memberService = {
  getAll: async (): Promise<Member[]> => {
    const response = await axiosInstance.get<Member[]>('/members/');
    return response.data;
  },

  getById: async (memberId: string): Promise<Member> => {
    const response = await axiosInstance.get<Member>(`/members/${memberId}/`);
    return response.data;
  },

  create: async (data: CreateMemberData): Promise<Member> => {
    const response = await axiosInstance.post<Member>('/members/', data);
    return response.data;
  },

  update: async (memberId: string, data: Partial<Member>): Promise<Member> => {
    const response = await axiosInstance.patch<Member>(
      `/members/${memberId}/`,
      data
    );
    return response.data;
  },

  delete: async (memberId: string): Promise<void> => {
    await axiosInstance.delete(`/members/${memberId}/`);
  },
};