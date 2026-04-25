# 라우팅

## 기본 구조

라우터는 `src/router/index.tsx`에서 `createBrowserRouter`로 정의합니다.

```tsx
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);
```

`App.tsx`는 `<RouterProvider router={router} />`만 렌더합니다.

## 새 라우트 추가 순서

1. `src/pages/[Name]Page.tsx` 생성
2. `src/router/index.tsx`에 경로 추가

## 경로 상수

경로 문자열 중복을 막기 위해 상수로 관리합니다.

```ts
// src/constants/routes.ts
export const ROUTES = {
  home: '/',
  login: '/login',
  user: (id: string) => `/users/${id}`,
} as const;
```

```tsx
import { ROUTES } from '@/constants/routes';
import { Link, useNavigate } from 'react-router-dom';

<Link to={ROUTES.login}>로그인</Link>

const navigate = useNavigate();
navigate(ROUTES.home);
```

## 브랜치 네이밍 (참고)

```
main          ← 프로덕션
dev           ← 스테이징 / 통합 (PR 대상)
feat/#123     ← 기능 브랜치 (GitHub 이슈 번호)
fix/#456      ← 버그 수정 브랜치
```

항상 `dev`에서 브랜치를 생성합니다.
