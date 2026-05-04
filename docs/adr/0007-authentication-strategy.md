# ADR-0007: 인증 전략 — 카카오 OAuth + Bearer JWT + Zustand

- **상태**: 승인됨 (Accepted)
- **날짜**: 2026-04-29 (최초), 2026-05-01 (수정)
- **결정자**: 팀 전체

---

## 맥락 (Context)

해파링 서비스의 대부분 기능(파티, 롤링페이퍼, 마이페이지 등)은 인증된 사용자만 접근할 수 있다.
홈 화면은 비회원도 접근 가능하며, 회원/비회원에 따라 조건부 렌더링한다.

백엔드는 카카오 OAuth 소셜 로그인 + JWT Bearer 토큰 방식을 사용한다.
- Dev: `https://dev-api.hapalin.com`
- Prod: `https://api.hapalin.com`

## 결정 (Decision)

### 1. 인증 방식: 카카오 OAuth + Bearer JWT

```
[클라이언트] → 카카오 로그인 URL로 리다이렉트
          → /oauth2/authorization/kakao
          → 카카오 인증 완료 → 서버가 JWT 발급 → 클라이언트로 리다이렉트 (토큰 포함)
[클라이언트] → Authorization: Bearer {token} → [서버]
[서버] → 401 (AUTH_EXPIRED_TOKEN) → [클라이언트] → logout → /login
```

- **로그인**: 카카오 OAuth (별도 이메일/비번 로그인 없음)
- **토큰 전송**: `Authorization: Bearer {token}` 헤더
- **토큰 저장**: Zustand `persist` (localStorage)
- **개발 환경**: `POST /api/dev/token?email={email}`로 토큰 직접 발급

### 2. 상태 관리: Zustand `useAuthStore`

ADR-0003에 따라 인증 정보는 클라이언트 상태이므로 Zustand에서 관리한다.

```typescript
// src/stores/useAuthStore.ts
interface AuthUser {
  id: number;
  name: string;
  email: string;
  provider: 'KAKAO' | 'GOOGLE' | 'APPLE' | 'NAVER';
  birthDay: string | null;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  setToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}
```

- `devtools` + `persist` 미들웨어 조합
- `persist`로 `accessToken`과 `user`를 `localStorage`에 유지

### 3. API 클라이언트 토큰 주입

`src/services/api.ts`의 `request()` 함수에서 `useAuthStore`의 토큰을 헤더에 자동 주입한다.

```typescript
// api.ts request 함수 내부
const token = useAuthStore.getState().accessToken;
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
};
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

Zustand store는 React 외부에서도 `getState()`로 접근 가능하므로 별도 interceptor 패턴 불필요.

### 4. 인증 서비스: `src/services/auth.ts`

ADR-0003의 도메인별 단일 파일 패턴을 따른다.

```typescript
// src/services/auth.ts
// 카카오 로그인 — 서버 OAuth URL로 리다이렉트
export function redirectToKakaoLogin() {
  window.location.href = `${config.apiBaseUrl}/oauth2/authorization/kakao`;
}

// 현재 사용자 조회
export function useMe() {
  return useQuery(authQueries.me());
}

// 개발용 토큰 발급
export function useDevToken() {
  return useMutation({
    mutationFn: (email: string) => api.post<DevTokenResponse>(`/api/dev/token?email=${email}`),
    onSuccess: (data) => {
      useAuthStore.getState().setToken(data.token);
    },
  });
}
```

### 5. 라우트 가드: `ProtectedRoute` 컴포넌트 (변경 없음)

### 6. 라우트 구조

```
/onboarding        ← 공개 (최초 진입)
/login             ← 공개 (카카오 로그인 버튼)
/                  ← 공개 (비회원/회원 조건부 렌더링)
/archive           ← 보호
/rolling-paper/:id ← 보호
/mypage            ← 보호
```

### 7. 인증 플로우

```
최초 방문 → /onboarding → 완료 → / (홈, 비회원)
                                    ↓
                             로그인 버튼 → 카카오 OAuth → 토큰 수신 → / (홈, 회원)
```

### 8. 토큰 만료 처리

```
API 요청 → 401 (AUTH_EXPIRED_TOKEN) → logout() → /login 리다이렉트
```

현재 BE에 별도 refresh 엔드포인트 없음. 토큰 만료 시 재로그인.

## 근거 (Rationale)

### 카카오 OAuth 선택 이유
- 국내 서비스에서 가장 높은 소셜 로그인 점유율
- 별도 회원가입 폼 불필요 → UX 단순화
- BE가 Spring Security OAuth2 기반으로 이미 구현 완료

### Bearer JWT 선택 이유
- BE가 JWT Bearer 방식으로 구현 (`securitySchemes: bearerAuth`)
- 프론트엔드에서 토큰을 직접 관리하므로 CORS 쿠키 설정 불필요
- `useAuthStore.getState()`로 React 외부에서도 토큰 접근 가능

### localStorage 저장 이유
- 새로고침 후에도 로그인 유지 필요 (모바일 웹앱 특성)
- XSS 방어는 React의 기본 이스케이핑 + CSP 헤더로 대응
- BE가 httpOnly 쿠키 미사용 → 클라이언트 저장 불가피

## 결과 (Consequences)

### 긍정적 결과
- 카카오 로그인으로 가입 허들 최소화
- Bearer 토큰으로 CORS 쿠키 이슈 없음
- 인증 로직이 `useAuthStore` + `src/services/auth.ts` 두 곳에 집중

### 부정적 결과 / 트레이드오프
- localStorage는 XSS에 취약할 수 있음 (React 이스케이핑으로 완화)
- refresh 토큰 미지원 → 토큰 만료 시 재로그인 필요
- OAuth 콜백 처리 로직 구현 필요

## 대안 (Alternatives Considered)

| 대안 | 탈락 이유 |
|------|-----------|
| httpOnly 쿠키 | BE가 Bearer JWT 방식으로 구현, 쿠키 미사용 |
| 이메일/비번 로그인 | BE에 해당 엔드포인트 없음, 카카오 OAuth만 지원 |
| React Context로 인증 상태 관리 | Zustand 대비 보일러플레이트 과다, API 레이어에서 접근 불편 |
