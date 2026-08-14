import { api } from './api';
import type { DashboardData } from '../types';

export const dashboardService = {
  async get(): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>('/dashboard');
    return data;
  },
};
