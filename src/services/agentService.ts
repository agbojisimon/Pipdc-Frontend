import { api } from './api';
import type { Agent, AgentSummary, Paginated } from '../types';

export const agentService = {
  async list(params?: { keyword?: string; page?: number; pageSize?: number }): Promise<Paginated<Agent>> {
    const { data } = await api.get<Paginated<Agent>>('/agents', { params });
    return data;
  },
  async getById(id: number): Promise<Agent> {
    const { data } = await api.get<Agent>(`/agents/${id}`);
    return data;
  },
  async me(): Promise<Agent> {
    const { data } = await api.get<Agent>('/agents/me');
    return data;
  },
  async create(payload: Record<string, unknown>): Promise<Agent> {
    const { data } = await api.post<Agent>('/agents', payload);
    return data;
  },
  async update(id: number, payload: Record<string, unknown>): Promise<Agent> {
    const { data } = await api.put<Agent>(`/agents/${id}`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/agents/${id}`);
  },
  async toggleVerification(id: number): Promise<Agent> {
    const { data } = await api.put<Agent>(`/agents/${id}/verify`);
    return data;
  },
  async getSummary(id: number): Promise<AgentSummary> {
    const { data } = await api.get<AgentSummary>(`/agents/${id}/summary`);
    return data;
  },
};
