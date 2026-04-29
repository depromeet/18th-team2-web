# ADR-0007: 인증 전략 — JWT Cookie + Zustand + Route Guard

- **상태**: 제안됨 (Proposed)
- **날짜**: 2026-04-29
- **결정자**: 팀 논의 필요

---

## 맥락 (Context)

해파링 서비스의 대부분 기능(홈, 파티, 롤링페이퍼, 마이페이지 등)은 인증된 사용자만 접근할 수 있다.
온보딩 완료 후 로그인/회원가입 플로우로 이동해야 하며, 인증 상태에 따라 라우트 접근을 제어해야 한다.

현재 상태:
- `src/stores/index.ts`에 `useAuthStore` 템플릿만 존재 (주석 처리)
- `src/services/api.ts`에 인증 관련 로직 없음
- 라우트 가드 없음 (모든 경로가 공개)
- 백엔드 API(`suker.iptime.org:8081`)에 인증 엔드포인트 미정의 상태

## 결정 (Decision)

### 1. 인증 방식: JWT를 Cookie로 관리

```
[클라이언트] → POST /auth/login → [서버] → Set-Cookie: accessToken, refreshToken (httpOnly)
[클라이언트] → 요청 (쿠키 자동 포함) → [서버]
[서버] → 401 → [클라이언트] → POST /auth/refresh → [서버] → Set-Cookie: accessToken (갱신)
```

- **토큰 저장**: 서버가 `Set-Cookie` 헤더로 httpOnly 쿠키에 저장
- **토큰 전송**: 브라우저가 요청 시 쿠키를 자동 포함 (`credentials: 'include'`)
- **프론트엔드에서 토큰을 직접 다루지 않음** — 쿠키 읽기/쓰기는 서버가 담당

### 2. 상태 관리: Zustand `useAuthStore`

ADR-0003에 따라 인증 UI 상태는 클라이언트 상태이므로 Zustand에서 관리한다.
**토큰은 쿠키에, 사용자 정보와 인증 여부는 Zustand에** 분리한다.

```typescript
// src/stores/useAuthStore.ts
interface AuthUser {
  id: string;
  nickname: string;
  profileImage: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;

  setUser: (user: AuthUser) => void;
  logout: () => void;
}
```

- `devtools` 미들웨어 사용
- `persist` 미들웨어로 `user` 정보를 `localStorage`에 유지 (새로고침 시 깜빡임 방지)
- 토큰은 Zustand에 저장하지 않음 (httpOnly 쿠키이므로 JS에서 접근 불가)

### 3. API 클라이언트 설정

`src/services/api.ts`의 `request()` 함수에 `credentials: 'include'`를 추가한다.
토큰이 쿠키에 있으므로 수동 헤더 주입이 필요 없다.

```typescript
// api.ts request 함수 내부
const response = await fetch(url, {
  ...options,
  credentials: 'include', // 쿠키 자동 포함
});
```

### 4. 인증 서비스: `src/services/auth.ts`

ADR-0003의 도메인별 단일 파일 패턴을 따른다.

```typescript
// src/services/auth.ts
export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginRequest) => api.post<AuthUser>('/auth/login', body),
    onSuccess: (user) => {
      // 토큰은 서버가 Set-Cookie로 처리, 프론트는 사용자 정보만 저장
      useAuthStore.getState().setUser(user);
    },
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
```

### 5. 라우트 가드: `ProtectedRoute` 컴포넌트

```typescript
// src/router/ProtectedRoute.tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

### 6. 라우트 구조

```
/onboarding        ← 공개 (최초 진입)
/login             ← 공개 (로그인)
/signup            ← 공개 (회원가입)
/                  ← 보호 (홈)
/archive           ← 보호 (아카이브)
/rolling-paper/:id ← 보호 (롤링페이퍼 확인)
/mypage            ← 보호 (마이페이지)
```

### 7. 인증 플로우

```
최초 방문 → /onboarding → 완료 → /login
                                    ↓
                             로그인 성공 → / (홈)
                                    ↓
                             미가입 → /signup → 가입 완료 → /login
```

### 8. 토큰 갱신 (Refresh)

```
API 요청 → 401 응답 → POST /auth/refresh (쿠키의 refreshToken 사용)
                         ↓ 성공 → 서버가 새 accessToken Set-Cookie → 원래 요청 재시도
                         ↓ 실패 → logout() → /login 리다이렉트
```

`api.ts`에서 401 응답 시 자동으로 refresh를 시도하고, 실패하면 로그아웃 처리한다.

## 근거 (Rationale)

### Cookie 저장 이유
- **XSS 방어**: httpOnly 쿠키는 JavaScript에서 접근 불가 → 토큰 탈취 위험 차단
- **자동 전송**: 브라우저가 매 요청에 쿠키를 자동 포함 → 프론트엔드 코드 단순화
- **서버 제어**: 토큰 만료, 갱신, 폐기를 서버가 Set-Cookie로 일관 관리

### Zustand 역할 분리 이유
- 토큰(보안 민감)은 쿠키 → 서버 관할
- 사용자 정보/인증 여부(UI 상태)는 Zustand → 프론트엔드 관할
- 관심사 분리로 보안과 UX를 동시에 확보

### ProtectedRoute 컴포넌트 방식 이유
- React Router v6의 `loader`를 쓸 수도 있지만, CSR 환경에서 컴포넌트 방식이 직관적
- 중첩 라우트에서 레이아웃과 함께 감싸기 쉬움

## 결과 (Consequences)

### 긍정적 결과
- httpOnly 쿠키로 XSS 토큰 탈취 방지
- 프론트엔드에서 토큰 관리 코드 불필요 (Authorization 헤더 주입 등)
- 인증 로직이 `useAuthStore` + `src/services/auth.ts` 두 곳에 집중

### 부정적 결과 / 트레이드오프
- 백엔드에서 CORS + 쿠키 설정 필요 (`Access-Control-Allow-Credentials: true`, `SameSite` 등)
- CSRF 공격 방어 필요 (SameSite 쿠키 속성 또는 CSRF 토큰)
- 개발 환경에서 프론트/백 도메인이 다를 경우 쿠키 전송을 위한 프록시 설정 필요

## 미결 사항 (Open Questions)

1. **소셜 로그인**: 카카오/구글 OAuth 지원 여부 → 백엔드 팀 확인 필요
2. **CSRF 방어**: SameSite=Strict로 충분한지, 별도 CSRF 토큰 필요한지 → 백엔드 팀 협의
3. **개발 환경 프록시**: Vite proxy로 쿠키 전송 문제 해결 가능한지 확인
4. **API 엔드포인트**: 백엔드 Swagger(`suker.iptime.org:8081/swagger-ui`) 확인 후 구체화

## 대안 (Alternatives Considered)

| 대안 | 탈락 이유 |
|------|-----------|
| localStorage에 토큰 저장 | XSS 공격 시 토큰 탈취 위험, 수동 헤더 주입 필요 |
| React Context로 인증 상태 관리 | Zustand 대비 보일러플레이트 과다, API 레이어에서 접근 불편 (`getState()` 불가) |
| TanStack Query로 인증 상태 관리 | ADR-0003 원칙 위반 (인증은 클라이언트 상태), 로그인/로그아웃이 캐시 무효화와 다름 |
| Router loader 기반 인증 체크 | data router로 전환 필요, 현재 BrowserRouter 구조와 불일치 |
