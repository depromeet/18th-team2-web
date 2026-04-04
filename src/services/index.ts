// 서비스 파일은 도메인별로 분리합니다.
//
// ── 패턴 ──────────────────────────────────────────────────────────────────
//
// [1] src/services/user.ts  →  queryOptions 팩토리 (쿼리키 + 쿼리함수 공동 관리)
//
//   import { queryOptions } from '@tanstack/react-query';
//   import type { User } from '@/types/user';
//   import { api } from '@/services/api';
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
// [2] src/hooks/useUser.ts  →  컴포넌트 진입점 (custom hook)
//
//   import { useQuery } from '@tanstack/react-query';
//   import { userQueries } from '@/services/user';
//
//   export function useUsers() {
//     return useQuery(userQueries.all());
//   }
//
//   export function useUser(id: string) {
//     return useQuery(userQueries.detail(id));
//   }
//
// ── 사용 ──────────────────────────────────────────────────────────────────
//
//   // 컴포넌트
//   const { data, isPending } = useUsers();
//
//   // mutation 후 캐시 무효화 (타입 안전)
//   queryClient.invalidateQueries(userQueries.all());
//
// ── 규칙 ──────────────────────────────────────────────────────────────────
//
//   - services/  →  queryOptions 팩토리, api 호출 함수
//   - hooks/     →  useQuery/useMutation을 감싼 custom hook
//   - mutation은 custom hook 안에 useMutation으로 정의 (services에 두지 않음)

export {};
