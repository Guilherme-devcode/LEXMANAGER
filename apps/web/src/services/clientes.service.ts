import api from '@/lib/api';
import { ClienteDto, PaginatedResponse } from '@lexmanager/shared';

export const clientesService = {
  async list(params?: { search?: string; page?: number; limit?: number }) {
    const { data } = await api.get<PaginatedResponse<ClienteDto>>('/clientes', { params });
    return data;
  },

  async get(id: string) {
    const { data } = await api.get<ClienteDto>(`/clientes/${id}`);
    return data;
  },

  async create(payload: Partial<ClienteDto>) {
    const { data } = await api.post<ClienteDto>('/clientes', payload);
    return data;
  },

  async update(id: string, payload: Partial<ClienteDto>) {
    const { data } = await api.patch<ClienteDto>(`/clientes/${id}`, payload);
    return data;
  },

  async remove(id: string) {
    await api.delete(`/clientes/${id}`);
  },
};
