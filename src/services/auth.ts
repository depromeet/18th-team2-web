import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { config } from '@/config/env';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { AuthUser } from '@/stores/useAuthStore';

// ── Types ──

interface DevTokenResponse {
  token: string;
  userId: number;
}

interface ApiResponse<T> {
  status: number;
  data: T;
}

// ── 카카오 OAuth ──

export function redirectToKakaoLogin() {
  const callbackUrl = `${window.location.origin}/oauth/callback`;
  window.location.href = `${config.apiBaseUrl}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(callbackUrl)}`;
}

// ── queryOptions 팩토리 ──

export const authQueries = {
  me: () =>
    queryOptions({
      queryKey: ['auth', 'me'],
      queryFn: () => api.get<ApiResponse<AuthUser>>('/api/auth/me'),
      enabled: !!useAuthStore.getState().accessToken,
    }),
};

// ── Query hooks ──

export function useMe() {
  return useQuery(authQueries.me());
}

// ── Mutation hooks ──

export function useLogout() {
  const queryClient = useQueryClient();
  return {
    logout: () => {
      useAuthStore.getState().logout();
      // 로그아웃 시 모든 서버 상태 캐시를 제거하여 다른 사용자 데이터 노출 방지
      queryClient.clear();
    },
  };
}

export function useDevToken() {
  return useMutation({
    mutationFn: (email: string) =>
      api.post<ApiResponse<DevTokenResponse>>(`/api/dev/token?email=${encodeURIComponent(email)}`),
    onSuccess: (res) => {
      const { setToken, redirectUrl, clearRedirectUrl } = useAuthStore.getState();
      setToken(res.data.token);
      if (redirectUrl) {
        clearRedirectUrl();
        window.location.href = redirectUrl;
      }
    },
  });
}
