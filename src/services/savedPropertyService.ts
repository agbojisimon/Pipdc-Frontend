import { api } from './api';
import type { Paginated, Property } from '../types';

export const savedPropertyService = {
  async list(params?: Record<string, unknown>): Promise<Paginated<Property>> {
    const { data } = await api.get<Paginated<Property>>('/saved-properties', { params });
    return data;
  },
  async ids(): Promise<number[]> {
    const { data } = await api.get<number[]>('/saved-properties/ids');
    return data;
  },
  async save(propertyId: number): Promise<void> {
    await api.post(`/saved-properties/${propertyId}`);
  },
  async unsave(propertyId: number): Promise<void> {
    await api.delete(`/saved-properties/${propertyId}`);
  },
};
