import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isInitializing: boolean;
  setSession: (accessToken: string, user: AuthUser) => void;
  clearSession: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isInitializing: true,

  setSession: (accessToken, user) => set({ accessToken, user }),
  clearSession: () => set({ accessToken: null, user: null }),

  login: async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    set({ accessToken: data.accessToken, user: data.user });
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      set({ accessToken: null, user: null });
    }
  },

  // Chamado uma vez no boot do app: tenta restaurar a sessão a partir do
  // cookie httpOnly de refresh token (sobrevive a reload de página, já que
  // o access token só existe em memória).
  bootstrap: async () => {
    try {
      const { data } = await apiClient.post('/auth/refresh');
      set({ accessToken: data.accessToken, user: data.user });
    } catch {
      set({ accessToken: null, user: null });
    } finally {
      set({ isInitializing: false });
    }
  },
}));
