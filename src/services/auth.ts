import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { AuthUser } from '@/stores/useAuthStore';

// ── Types ──

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

// ── Mutation hooks ──

export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginRequest) => api.post<AuthUser>('/auth/login', body),
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (body: SignupRequest) => api.post<AuthUser>('/auth/signup', body),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      useAuthStore.getState().logout();
      queryClient.clear();
    },
  });
}
