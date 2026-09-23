// src/services/userService.ts

import axiosInstance from '../api/axiosInstance';
import { User } from '../types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/account/users/');
    return response.data;
  },

  getById: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get<User>(`/account/users/${userId}/`);
    return response.data;
  },

  update: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.patch<User>(
      `/account/users/${userId}/`,
      data
    );
    return response.data;
  },

  delete: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/account/users/${userId}/`);
  },
};