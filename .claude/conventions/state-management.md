# 상태 관리

## 어떤 상태를 어디에 둘까?

| 상태 종류 | 위치 | 예시 |
| --- | --- | --- |
| 서버 데이터 (API 응답) | TanStack Query (`services/`) | 유저 목록, 게시글 상세 |
| 전역 클라이언트 UI 상태 | Zustand (`stores/`) | 로그인 여부, 모달 오픈, 테마 |
| 로컬 UI 상태 | `useState` | 입력 값, 토글, 폼 필드 |
| 파생 상태 | `useMemo` / `useCallback` | 필터된 목록, 포맷된 날짜 |

**API 응답을 Zustand에 저장하지 않습니다.** TanStack Query 캐시가 서버 상태의 단일 진실 공급원입니다.

---

## TanStack Query

### 서비스 파일 구조 (`src/services/[도메인].ts`)

```ts
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { components } from '@/types/api';
import { api } from '@/services/api';

type User = components['schemas']['User'];

// 1. queryOptions 팩토리 (invalidation/prefetch에 재사용)
export const userQueries = {
  all: () => queryOptions({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('/users'),
  }),
  detail: (id: string) => queryOptions({
    queryKey: ['users', id],
    queryFn: () => api.get<User>(`/users/${id}`),
    enabled: !!id,
  }),
};

// 2. Query 훅
export function useUsers() {
  return useQuery(userQueries.all());
}

export function useUser(id: string) {
  return useQuery(userQueries.detail(id));
}

// 3. Mutation 훅
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<User>) => api.patch<User>(`/users/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries(userQueries.all());
      queryClient.invalidateQueries(userQueries.detail(id));
    },
  });
}
```

### QueryClient 기본값 (`main.tsx`)

- `staleTime`: 1분 (데이터 신선도)
- `gcTime`: 5분 (캐시 유지)
- 4xx → 재시도 안 함 / 5xx → 최대 1회 재시도

---

## Zustand

### 스토어 구조 (`src/stores/use[Domain]Store.ts`)

```ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: null | { id: string; name: string };
  // 액션을 상태와 함께 정의
  login: (user: { id: string; name: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }, false, 'login'),
      logout: () => set({ isAuthenticated: false, user: null }, false, 'logout'),
    }),
    { name: 'AuthStore' }, // devtools 탭 이름 필수
  ),
);
```

### 규칙

- 도메인별 1개 스토어
- 항상 `devtools` 미들웨어 사용
- 액션 이름 3번째 인자로 명시 (devtools 추적용)
- 서버 데이터 저장 금지
