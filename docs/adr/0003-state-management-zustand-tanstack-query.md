# ADR-0003: 상태 관리 — Zustand + TanStack Query 분리

- **상태**: 승인됨 (Accepted)
- **날짜**: 2026-04-04
- **결정자**: 팀 전체

---

## 맥락 (Context)

React 애플리케이션의 상태는 성격이 다른 두 가지로 나뉜다:

1. **클라이언트 상태**: UI 상태, 인증 정보, 모달 열림 여부, 사용자 설정 등
2. **서버 상태**: API에서 가져온 데이터, 캐시, 로딩/에러 상태, 백그라운드 동기화

이 둘을 하나의 라이브러리(예: Redux)로 관리하면 서버 상태의 캐싱, 리패칭, 낙관적 업데이트 등을
직접 구현해야 해서 복잡도가 급격히 증가한다.

## 결정 (Decision)

- **클라이언트 상태**: Zustand v5
- **서버 상태**: TanStack Query v5 (Hybrid 패턴 사용)

### 도메인별 단일 파일 패턴

한 도메인의 서버 상태(queryOptions + query hook + mutation hook)를 `src/services/[도메인].ts` 한 파일에 정의한다.
`src/hooks/`에는 서버 상태 관련 훅을 두지 않고 순수 클라이언트 훅(useDebounce 등)만 둔다.

```typescript
// src/services/user.ts — 한 도메인의 서버 상태 전부
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { User } from '@/types/user';

// ── queryOptions 팩토리 ──

export const userQueries = {
  all: () =>
    queryOptions({
      queryKey: ['users'],
      queryFn: () => api.get<User[]>('/users'),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['users', id],
      queryFn: () => api.get<User>(`/users/${id}`),
      enabled: !!id,
    }),
};

// ── Query hooks ──

export function useUsers() {
  return useQuery(userQueries.all());
}

// ── Mutation hooks ──

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string }) => api.post<User>('/users', body),
    onSuccess: () => queryClient.invalidateQueries(userQueries.all()),
  });
}

// 컴포넌트에서
const { data } = useUsers();
const { mutate } = useCreateUser();
```

## 근거 (Rationale)

### Zustand 선택 이유
- Redux 대비 보일러플레이트가 극히 적어 도메인별 스토어를 빠르게 만들 수 있다.
- TypeScript 지원이 자연스럽고 별도 제네릭 헬퍼 없이 타입 추론이 가능하다.
- `devtools` 미들웨어로 Redux DevTools에서 상태 변화를 추적할 수 있다.
- v5에서 `useShallow` 훅이 안정화되어 불필요한 리렌더링을 줄일 수 있다.

### TanStack Query 선택 이유
- 서버 상태의 캐싱, 백그라운드 리패칭, stale-while-revalidate를 선언적으로 처리한다.
- 도메인별 단일 파일 패턴으로 queryOptions + hook이 물리적으로 가까워 응집도가 높다.
- `queryOptions()` 팩토리는 쿼리키와 쿼리함수를 한 곳에서 관리해 문자열 오타로 인한 버그를 방지한다.
- `useQuery`, `useSuspenseQuery`, `prefetchQuery` 등 모두 동일 options 객체를 재사용한다.
- 낙관적 업데이트(optimistic update), 무한 스크롤, 인터렉티브 페이지네이션을 내장 지원한다.

### 분리 원칙
- **Zustand store에 API 응답 데이터를 저장하지 않는다** — 서버 데이터는 TanStack Query 캐시가 진실의 근원
- **TanStack Query 캐시를 UI 상태 저장소로 사용하지 않는다** — UI 상태는 Zustand 또는 컴포넌트 로컬 state

## 결과 (Consequences)

### 긍정적 결과
- 각 상태의 특성에 맞는 최적화된 도구 사용
- 서버 상태의 캐시 무효화, 낙관적 업데이트가 선언적으로 가능
- 개발자 도구(React Query Devtools, Redux DevTools)로 상태 디버깅 용이

### 부정적 결과 / 트레이드오프
- 두 라이브러리의 개념을 모두 학습해야 함
- 어떤 상태를 어디에 둘지 팀 내 기준 합의 필요 (이 ADR이 그 기준)

## 대안 (Alternatives Considered)

| 대안 | 탈락 이유 |
|------|-----------|
| Redux Toolkit + RTK Query | 보일러플레이트 과다, 학습 곡선 높음 |
| Jotai | atomic 모델이 팀 패턴과 맞지 않음, 대형 앱에서 atom 관리 복잡 |
| SWR | TanStack Query 대비 mutation, optimistic update 기능 부족 |
| Context API + useReducer | 복잡한 서버 상태 처리에 부적합, 불필요한 리렌더링 |
