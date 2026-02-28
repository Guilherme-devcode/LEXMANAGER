import { create } from 'zustand';
import { UserDto } from '@lexmanager/shared';

interface AuthState {
  accessToken: string | null;
  user: UserDto | null;
  setAccessToken: (token: string) => void;
  setUser: (user: UserDto) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  logout: () => set({ accessToken: null, user: null }),
}));
