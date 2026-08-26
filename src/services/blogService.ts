import { api } from './api';
import type { BlogPost, Category, Paginated, Tag } from '../types';

export interface BlogFilters {
  keyword?: string;
  status?: string;
  categoryId?: number;
  tagId?: number;
  pageNumber?: number;
  pageSize?: number;
}

export const blogService = {
  async list(params?: BlogFilters): Promise<Paginated<BlogPost>> {
    const { data } = await api.get<Paginated<BlogPost>>('/blog', { params });
    return data;
  },
  async listManaged(params?: BlogFilters): Promise<Paginated<BlogPost>> {
    const { data } = await api.get<Paginated<BlogPost>>('/blog/manage', { params });
    return data;
  },
  async getBySlug(slug: string): Promise<BlogPost> {
    const { data } = await api.get<BlogPost>(`/blog/${slug}`);
    return data;
  },
  async getRelated(slug: string): Promise<BlogPost[]> {
    const { data } = await api.get<BlogPost[]>(`/blog/${slug}/related`);
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
  async publish(id: number): Promise<BlogPost> {
    const { data } = await api.patch<BlogPost>(`/blog/${id}/publish`);
    return data;
  },
  async unpublish(id: number): Promise<BlogPost> {
    const { data } = await api.patch<BlogPost>(`/blog/${id}/unpublish`);
    return data;
  },
  async categories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/blog/categories');
    return data;
  },
  async createCategory(payload: { name: string; slug?: string }): Promise<Category> {
    const { data } = await api.post<Category>('/blog/categories', payload);
    return data;
  },
  async removeCategory(id: number): Promise<void> {
    await api.delete(`/blog/categories/${id}`);
  },
  async tags(): Promise<Tag[]> {
    const { data } = await api.get<Tag[]>('/blog/tags');
    return data;
  },
  async createTag(payload: { name: string; slug?: string }): Promise<Tag> {
    const { data } = await api.post<Tag>('/blog/tags', payload);
    return data;
  },
  async removeTag(id: number): Promise<void> {
    await api.delete(`/blog/tags/${id}`);
  },
};
