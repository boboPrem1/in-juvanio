// src/store/useAuthStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  accessToken: null,
  user:        null,
  isLoading:   false,

  setAccessToken: (token) => set({ accessToken: token }),

  setUser: (user) => set({ user }),

  login: (token, user) => set({ accessToken: token, user, isLoading: false }),

  logout: () => {
    set({ accessToken: null, user: null });
    // Redirection gérée dans le composant AuthGuard
    window.dispatchEvent(new Event('auth:logout'));
  },

  setLoading: (v) => set({ isLoading: v }),
}));
