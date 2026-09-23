// src/services/bookService.ts

import axiosInstance from '../api/axiosInstance';
import { Book } from '../types';

type CreateBookData = Omit<Book, 'book_id' | 'created_at' | 'category_name'>;

export const bookService = {
  getAll: async (): Promise<Book[]> => {
    const response = await axiosInstance.get<Book[]>('/library/books/');
    return response.data;
  },

  getById: async (bookId: string): Promise<Book> => {
    const response = await axiosInstance.get<Book>(`/library/books/${bookId}/`);
    return response.data;
  },

  create: async (data: CreateBookData): Promise<Book> => {
    const response = await axiosInstance.post<Book>('/library/books/', data);
    return response.data;
  },

  update: async (bookId: string, data: Partial<Book>): Promise<Book> => {
    const response = await axiosInstance.patch<Book>(
      `/library/books/${bookId}/`,
      data
    );
    return response.data;
  },

  delete: async (bookId: string): Promise<void> => {
    await axiosInstance.delete(`/library/books/${bookId}/`);
  },
};