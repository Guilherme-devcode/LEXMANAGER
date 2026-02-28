import api from '@/lib/api';
import { ProcessoDto, PaginatedResponse } from '@lexmanager/shared';

export const processosService = {
  async list(params?: {
    search?: string;
    status?: string;
    area?: string;
    responsavelId?: string;
    page?: number;
    limit?: number;
  }) {
    const { data } = await api.get<PaginatedResponse<ProcessoDto>>('/processos', { params });
    return data;
  },

  async get(id: string) {
    const { data } = await api.get<ProcessoDto>(`/processos/${id}`);
    return data;
  },

  async create(payload: Partial<ProcessoDto>) {
    const { data } = await api.post<ProcessoDto>('/processos', payload);
    return data;
  },

  async update(id: string, payload: Partial<ProcessoDto>) {
    const { data } = await api.patch<ProcessoDto>(`/processos/${id}`, payload);
    return data;
  },

  async remove(id: string) {
    await api.delete(`/processos/${id}`);
  },

  async addMovimentacao(id: string, payload: { titulo: string; descricao: string; dataMovimentacao?: string }) {
    const { data } = await api.post(`/processos/${id}/movimentacoes`, payload);
    return data;
  },

  async addCliente(id: string, payload: { clienteId: string; papel?: string }) {
    const { data } = await api.post(`/processos/${id}/clientes`, payload);
    return data;
  },
};
