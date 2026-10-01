import { api } from './client';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export async function login(email: string, password: string) {
  const res = await api.post<{ user: AuthUser }>('/auth/login', { email, password });
  return res.data.user;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function fetchMe() {
  const res = await api.get<{ user: AuthUser }>('/auth/me');
  return res.data.user;
}
