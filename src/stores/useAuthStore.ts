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
  redirectUrl: string | null;

  setToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  setRedirectUrl: (url: string) => void;
  clearRedirectUrl: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        redirectUrl: null,

        setToken: (token) => set({ accessToken: token, isAuthenticated: true }, false, 'setToken'),
        setUser: (user) => set({ user }, false, 'setUser'),
        setRedirectUrl: (url) => set({ redirectUrl: url }, false, 'setRedirectUrl'),
        clearRedirectUrl: () => set({ redirectUrl: null }, false, 'clearRedirectUrl'),
        logout: () =>
          set(
            { accessToken: null, user: null, isAuthenticated: false, redirectUrl: null },
            false,
            'logout',
          ),
      }),
      { name: 'auth-storage' },
    ),
    { name: 'AuthStore' },
  ),
);
