import api from '@/lib/api';
import { UserDto } from '@lexmanager/shared';

export const usersService = {
  async list() {
    const { data } = await api.get<UserDto[]>('/users');
    return data;
  },

  async create(payload: { nome: string; email: string; senha: string; role: string }) {
    const { data } = await api.post<UserDto>('/users', payload);
    return data;
  },

  async update(id: string, payload: Partial<{ nome: string; role: string; ativo: boolean; senha: string }>) {
    const { data } = await api.patch<UserDto>(`/users/${id}`, payload);
    return data;
  },
};
