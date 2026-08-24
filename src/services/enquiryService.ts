import { api } from './api';
import type { AgentEnquirySummary, AgentNotifyResult, Enquiry, Paginated } from '../types';

export interface CreateEnquiryPayload {
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
  async getById(id: number): Promise<Enquiry> {
    const { data } = await api.get<Enquiry>(`/enquiries/${id}`);
    return data;
  },
  async mine(params?: Record<string, unknown>): Promise<Paginated<Enquiry>> {
    const { data } = await api.get<Paginated<Enquiry>>('/enquiries/mine', { params });
    return data;
  },
  async mineByProperty(propertyId: number): Promise<Enquiry | null> {
    const { data } = await api.get<Paginated<Enquiry>>('/enquiries/mine', {
      params: { propertyId, pageSize: 1 },
    });
    return data.items[0] ?? null;
  },
  async agentSummaries(params?: Record<string, unknown>): Promise<Paginated<AgentEnquirySummary>> {
    const { data } = await api.get<Paginated<AgentEnquirySummary>>('/enquiries/agents/summary', { params });
    return data;
  },
  async byAgent(agentId: number, params?: Record<string, unknown>): Promise<Paginated<Enquiry>> {
    const { data } = await api.get<Paginated<Enquiry>>(`/enquiries/agents/${agentId}`, { params });
    return data;
  },
  async byProperty(propertyId: number, params?: Record<string, unknown>): Promise<Paginated<Enquiry>> {
    const { data } = await api.get<Paginated<Enquiry>>(`/enquiries/property/${propertyId}`, { params });
    return data;
  },
  async notifyAgent(id: number): Promise<AgentNotifyResult> {
    const { data } = await api.post<AgentNotifyResult>(`/enquiries/${id}/notify-agent`);
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
