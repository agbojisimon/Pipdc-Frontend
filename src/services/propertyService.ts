import { api } from './api';
import type { Paginated, Property, PropertyFilters } from '../types';

export const propertyService = {
  async list(filters?: PropertyFilters): Promise<Paginated<Property>> {
    const { data } = await api.get<Paginated<Property>>('/properties', { params: filters });
    return data;
  },
  async featured(): Promise<Property[]> {
    const { data } = await api.get<Property[]>('/properties/featured');
    return data;
  },
  async getBySlug(slug: string): Promise<Property> {
    const { data } = await api.get<Property>(`/properties/slug/${slug}`);
    return data;
  },
  async getById(id: number): Promise<Property> {
    const { data } = await api.get<Property>(`/properties/${id}`);
    return data;
  },
  async similar(id: number): Promise<Property[]> {
    const { data } = await api.get<Property[]>(`/properties/${id}/similar`);
    return data;
  },
  async create(payload: Record<string, unknown>): Promise<Property> {
    const { data } = await api.post<Property>('/properties', payload);
    return data;
  },
  async update(id: number, payload: Record<string, unknown>): Promise<Property> {
    const { data } = await api.put<Property>(`/properties/${id}`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/properties/${id}`);
  },
};
