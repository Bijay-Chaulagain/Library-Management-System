// src/types/index.ts

export interface User {
  user_id: string;
  username: string;
  email: string;
  role: 'admin' | 'librarian' | 'member';
  is_active: boolean;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Category {
  category_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Book {
  book_id: string;
  title: string;
  ISBN: string;
  author: string;
  publisher: string;
  category: string;
  category_name: string;
  quantity: number;
  available_quantity: number;
  created_at: string;
}

export interface Member {
  member_id: string;
  membership_no: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  join_date: string;
}

export interface Transaction {
  transaction_id: string;
  member: string;
  member_name: string;
  book: string;
  book_title: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: 'borrowed' | 'returned' | 'overdue';
  fine_amount: string;
}