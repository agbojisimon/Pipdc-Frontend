import { api } from './api';
import type { Paginated, User, UserDetail } from '../types';

export interface UserFilters {
  keyword?: string;
  role?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const userService = {
  async list(params?: UserFilters): Promise<Paginated<User>> {
    const { data } = await api.get<Paginated<User>>('/users', { params });
    return data;
  },
  async getById(id: string): Promise<UserDetail> {
    const { data } = await api.get<UserDetail>(`/users/${id}`);
    return data;
  },
  async deactivate(id: string): Promise<void> {
    await api.post(`/users/${id}/deactivate`);
  },
  async activate(id: string): Promise<void> {
    await api.post(`/users/${id}/activate`);
  },
};
