// src/services/categoryService.ts

import axiosInstance from '../api/axiosInstance';
import { Category } from '../types';

type CreateCategoryData = Omit<Category, 'category_id' | 'created_at'>;

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/library/categories/');
    return response.data;
  },

  getById: async (categoryId: string): Promise<Category> => {
    const response = await axiosInstance.get<Category>(
      `/library/categories/${categoryId}/`
    );
    return response.data;
  },

  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await axiosInstance.post<Category>(
      '/library/categories/',
      data
    );
    return response.data;
  },

  update: async (categoryId: string, data: Partial<Category>): Promise<Category> => {
    const response = await axiosInstance.patch<Category>(
      `/library/categories/${categoryId}/`,
      data
    );
    return response.data;
  },

  delete: async (categoryId: string): Promise<void> => {
    await axiosInstance.delete(`/library/categories/${categoryId}/`);
  },
};
