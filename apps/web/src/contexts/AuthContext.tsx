import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserDto } from '@lexmanager/shared';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

interface AuthContextValue {
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  registerTenant: (data: RegisterTenantData) => Promise<void>;
}

interface RegisterTenantData {
  nomeTenant: string;
  emailTenant: string;
  nomeUsuario: string;
  emailUsuario: string;
  senha: string;
  cnpj?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, user, setAccessToken, setUser, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to restore session via refresh token
  useEffect(() => {
    const restore = async () => {
      try {
        const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
        setAccessToken(data.accessToken);
        const meRes = await api.get<UserDto>('/auth/me', {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        setUser(meRes.data);
      } catch {
        // No valid session — user stays logged out
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const { data } = await api.post<{ accessToken: string }>('/auth/login', { email, senha });
    setAccessToken(data.accessToken);
    const meRes = await api.get<UserDto>('/auth/me');
    setUser(meRes.data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    storeLogout();
  }, []);

  const registerTenant = useCallback(async (data: RegisterTenantData) => {
    const res = await api.post<{ accessToken: string }>('/auth/register-tenant', data);
    setAccessToken(res.data.accessToken);
    const meRes = await api.get<UserDto>('/auth/me');
    setUser(meRes.data);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!accessToken && !!user,
        login,
        logout,
        registerTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
