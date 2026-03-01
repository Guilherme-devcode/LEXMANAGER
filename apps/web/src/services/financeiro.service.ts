import api from '@/lib/api';
import { LancamentoDto, PaginatedResponse } from '@lexmanager/shared';

export const financeiroService = {
  async list(params?: { tipo?: string; status?: string; page?: number; limit?: number }) {
    const { data } = await api.get<PaginatedResponse<LancamentoDto>>('/financeiro/lancamentos', { params });
    return data;
  },

  async create(payload: Partial<LancamentoDto> & { valor: number; dataVencimento: string }) {
    const { data } = await api.post<LancamentoDto>('/financeiro/lancamentos', payload);
    return data;
  },

  async update(id: string, payload: Partial<LancamentoDto>) {
    const { data } = await api.patch<LancamentoDto>(`/financeiro/lancamentos/${id}`, payload);
    return data;
  },

  async pagar(id: string) {
    const { data } = await api.patch<LancamentoDto>(`/financeiro/lancamentos/${id}/pagar`);
    return data;
  },

  async cancelar(id: string) {
    const { data } = await api.delete<LancamentoDto>(`/financeiro/lancamentos/${id}`);
    return data;
  },
};
