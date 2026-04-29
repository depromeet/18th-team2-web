import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  nickname: string;
  profileImage: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;

  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,

        setUser: (user) => set({ user, isAuthenticated: true }, false, 'setUser'),
        logout: () => set({ user: null, isAuthenticated: false }, false, 'logout'),
      }),
      { name: 'auth-storage' },
    ),
    { name: 'AuthStore' },
  ),
);
