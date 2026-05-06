import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { components } from '@/types/api';
import { config } from '@/config/env';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/useAuthStore';

// ── Types (from OpenAPI) ──

type UserResponse = components['schemas']['UserResponse'];
type DevTokenResponse = components['schemas']['DevTokenResponse'];
type ApiResponseUserResponse = components['schemas']['ApiResponseUserResponse'];
type ApiResponseDevTokenResponse = components['schemas']['ApiResponseDevTokenResponse'];

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
      queryFn: () => api.get<ApiResponseUserResponse>('/api/auth/me'),
    }),
};

// ── Query hooks ──

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    ...authQueries.me(),
    enabled: !!accessToken,
  });
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
      api.post<ApiResponseDevTokenResponse>(`/api/dev/token?email=${encodeURIComponent(email)}`),
    onSuccess: (res) => {
      const { setToken, redirectUrl, clearRedirectUrl } = useAuthStore.getState();
      if (res.data?.token) {
        setToken(res.data.token);
      }
      if (redirectUrl) {
        clearRedirectUrl();
        window.location.href = redirectUrl;
      }
    },
  });
}

// Re-export for components
export type { UserResponse, DevTokenResponse };
