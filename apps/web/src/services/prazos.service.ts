import api from '@/lib/api';
import { PrazoDto, PaginatedResponse } from '@lexmanager/shared';

export const prazosService = {
  async list(params?: { status?: string; responsavelId?: string; page?: number; limit?: number }) {
    const { data } = await api.get<PaginatedResponse<PrazoDto>>('/prazos', { params });
    return data;
  },

  async create(payload: Partial<PrazoDto> & { dataVencimento: string }) {
    const { data } = await api.post<PrazoDto>('/prazos', payload);
    return data;
  },

  async update(id: string, payload: Partial<PrazoDto>) {
    const { data } = await api.patch<PrazoDto>(`/prazos/${id}`, payload);
    return data;
  },
};
