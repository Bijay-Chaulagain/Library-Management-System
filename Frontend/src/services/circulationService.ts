// src/services/circulationService.ts

import axiosInstance from '../api/axiosInstance';
import { Transaction } from '../types';

export const circulationService = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await axiosInstance.get<Transaction[]>('/circulation/');
    return response.data;
  },

  borrowBook: async (
    memberId: string,
    bookId: string,
    dueDate: string
  ): Promise<Transaction> => {
    const response = await axiosInstance.post<Transaction>('/circulation/', {
      member: memberId,
      book: bookId,
      due_date: dueDate,
    });
    return response.data;
  },

  returnBook: async (transactionId: string): Promise<Transaction> => {
    const response = await axiosInstance.post<Transaction>(
      `/circulation/${transactionId}/return/`
    );
    return response.data;
  },
};