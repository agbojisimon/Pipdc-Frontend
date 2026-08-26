import { api } from './api';
import type { Location } from '../types';

export interface LocationListParams {
  type?: string;
  parentId?: number;
}

export const locationService = {
  async list(params?: LocationListParams): Promise<Location[]> {
    const { data } = await api.get<Location[]>('/locations', { params });
    return data;
  },
  async getHierarchy(): Promise<Location[]> {
    const { data } = await api.get<Location[]>('/locations/hierarchy');
    return data;
  },
  async getById(id: number): Promise<Location> {
    const { data } = await api.get<Location>(`/locations/${id}`);
    return data;
  },
  async create(payload: { name: string; type: string; parentId?: number | null }): Promise<Location> {
    const { data } = await api.post<Location>('/locations', payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/locations/${id}`);
  },
};
