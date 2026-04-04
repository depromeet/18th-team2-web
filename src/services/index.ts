// 서비스 파일은 도메인별로 분리합니다.
//
// ── 패턴 ──────────────────────────────────────────────────────────────────
//
// src/services/user.ts — 한 도메인의 서버 상태 전부
//
//   import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
//   import type { User } from '@/types/user';
//   import { api } from '@/services/api';
//
//   // ── queryOptions 팩토리 ──
//
//   export const userQueries = {
//     all: () =>
//       queryOptions({
//         queryKey: ['users'],
//         queryFn: () => api.get<User[]>('/users'),
//       }),
//     detail: (id: string) =>
//       queryOptions({
//         queryKey: ['users', id],
//         queryFn: () => api.get<User>(`/users/${id}`),
//         enabled: !!id,
//       }),
//   };
//
//   // ── Query hooks ──
//
//   export function useUsers() {
//     return useQuery(userQueries.all());
//   }
//
//   // ── Mutation hooks ──
//
//   export function useCreateUser() {
//     const queryClient = useQueryClient();
//     return useMutation({
//       mutationFn: (body: { name: string }) => api.post<User>('/users', body),
//       onSuccess: () => queryClient.invalidateQueries(userQueries.all()),
//     });
//   }
//
// ── 사용 ──────────────────────────────────────────────────────────────────
//
//   const { data } = useUsers();
//   const { mutate } = useCreateUser();
//
// ── 규칙 ──────────────────────────────────────────────────────────────────
//
//   - services/  →  queryOptions + query hook + mutation hook (도메인별 단일 파일)
//   - hooks/     →  서버와 무관한 순수 클라이언트 훅만 (useDebounce, useMediaQuery 등)

export {};
