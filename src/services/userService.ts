import { api } from './api';
import type { Paginated, User } from '../types';

export const userService = {
  async list(params?: Record<string, unknown>): Promise<Paginated<User>> {
    const { data } = await api.get<Paginated<User>>('/users', { params });
    return data;
  },
};
