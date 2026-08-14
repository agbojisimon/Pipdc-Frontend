import { api } from './api';
import type { Enquiry, Paginated } from '../types';

export interface CreateEnquiryPayload {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  propertyId: number;
}

export const enquiryService = {
  async create(payload: CreateEnquiryPayload): Promise<Enquiry> {
    const { data } = await api.post<Enquiry>('/enquiries', payload);
    return data;
  },
  async list(params?: Record<string, unknown>): Promise<Paginated<Enquiry>> {
    const { data } = await api.get<Paginated<Enquiry>>('/enquiries', { params });
    return data;
  },
  async mine(params?: Record<string, unknown>): Promise<Paginated<Enquiry>> {
    const { data } = await api.get<Paginated<Enquiry>>('/enquiries/mine', { params });
    return data;
  },
  async update(id: number, payload: { fullName: string; email: string; phone?: string | null; message: string; status: string }): Promise<Enquiry> {
    const { data } = await api.put<Enquiry>(`/enquiries/${id}`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/enquiries/${id}`);
  },
};
