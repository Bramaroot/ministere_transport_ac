export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  username: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
}

export interface UserFilters {
  search?: string;
  role?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
