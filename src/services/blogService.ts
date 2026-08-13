import { api } from './api';
import type { BlogPost } from '../types';

export const blogService = {
  async list(): Promise<BlogPost[]> {
    const { data } = await api.get<BlogPost[]>('/blog');
    return data;
  },
  async getBySlug(slug: string): Promise<BlogPost> {
    const { data } = await api.get<BlogPost>(`/blog/${slug}`);
    return data;
  },
  async create(payload: Record<string, unknown>): Promise<BlogPost> {
    const { data } = await api.post<BlogPost>('/blog', payload);
    return data;
  },
  async update(id: number, payload: Record<string, unknown>): Promise<BlogPost> {
    const { data } = await api.put<BlogPost>(`/blog/${id}`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/blog/${id}`);
  },
};
