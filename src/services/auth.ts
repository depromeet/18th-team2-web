import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { AuthUser } from '@/stores/useAuthStore';

// ── Types ──
// TODO: BE Swagger 연동 후 components['schemas']에서 import로 교체

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
      // 로그아웃 시 모든 서버 상태 캐시를 제거하여 다른 사용자 데이터 노출 방지
      queryClient.clear();
    },
  });
}
