// src/services/authService.ts

import axiosInstance from '../api/axiosInstance';
import { LoginResponse, User } from '../types';

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/account/login/', {
      username,
      password,
    });
    return response.data;
  },

  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/account/register/', {
      username,
      email,
      password,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/account/me/');
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};