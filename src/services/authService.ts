import { api } from './api';
import type { AuthResponse, AuthUser } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  async register(payload: RegisterPayload): Promise<void> {
    await api.post('/auth/register', payload);
  },
  async refresh(refreshToken: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  },
  async revoke(refreshToken: string): Promise<void> {
    try {
      await api.post('/auth/revoke', { refreshToken });
    } catch {
      // Best-effort revoke.
    }
  },
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },
  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>('/auth/me');
    return data;
  },
  async updateProfile(payload: { firstName: string; lastName: string; phoneNumber?: string | null }): Promise<AuthUser> {
    const { data } = await api.put<AuthUser>('/auth/me', payload);
    return data;
  },
  async addRole(payload: { email: string; role: string }): Promise<void> {
    await api.post('/auth/add-role', payload);
  },
  async removeRole(payload: { email: string; role: string }): Promise<void> {
    await api.post('/auth/remove-role', payload);
  },
};
