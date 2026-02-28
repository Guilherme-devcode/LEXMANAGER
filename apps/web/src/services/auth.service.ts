import api from '@/lib/api';
import { UserDto } from '@lexmanager/shared';

export const authService = {
  async login(email: string, senha: string) {
    const { data } = await api.post<{ accessToken: string }>('/auth/login', { email, senha });
    return data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async refresh() {
    const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
    return data;
  },

  async me() {
    const { data } = await api.get<UserDto>('/auth/me');
    return data;
  },

  async registerTenant(payload: {
    nomeTenant: string;
    emailTenant: string;
    nomeUsuario: string;
    emailUsuario: string;
    senha: string;
    cnpj?: string;
  }) {
    const { data } = await api.post<{ accessToken: string }>('/auth/register-tenant', payload);
    return data;
  },
};
