import { api } from './api';

export interface UploadResult {
  url: string;
  publicId: string;
}

export const imageService = {
  async upload(file: File, folder = 'general'): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<UploadResult>(`/images/upload?folder=${folder}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return data;
  },
  async remove(publicId: string): Promise<void> {
    await api.delete(`/images/${encodeURIComponent(publicId)}`);
  },
};
