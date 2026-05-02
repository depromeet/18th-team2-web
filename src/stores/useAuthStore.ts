import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  provider: 'KAKAO' | 'GOOGLE' | 'APPLE' | 'NAVER';
  birthDay: string | null;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  setToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        user: null,
        isAuthenticated: false,

        setToken: (token) => set({ accessToken: token, isAuthenticated: true }, false, 'setToken'),
        setUser: (user) => set({ user }, false, 'setUser'),
        logout: () =>
          set({ accessToken: null, user: null, isAuthenticated: false }, false, 'logout'),
      }),
      { name: 'auth-storage' },
    ),
    { name: 'AuthStore' },
  ),
);
