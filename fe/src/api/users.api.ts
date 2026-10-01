import { api } from './client';

export interface AppUser {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UsersResult {
  data: AppUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchUsers(page = 1, limit = 10) {
  const res = await api.get<UsersResult>('/users', { params: { page, limit } });
  return res.data;
}

export async function createUser(payload: { email: string; password: string; role: string }) {
  const res = await api.post<AppUser>('/users', payload);
  return res.data;
}

export async function updateUser(id: string, payload: { email?: string; password?: string; role?: string }) {
  const res = await api.patch<AppUser>(`/users/${id}`, payload);
  return res.data;
}

export async function deleteUser(id: string) {
  await api.delete(`/users/${id}`);
}
