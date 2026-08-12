# API 패턴

## api 클라이언트

`src/services/api.ts`의 `api` 객체를 사용합니다. `fetch()`를 직접 호출하지 마세요.

```ts
import { api } from '@/services/api';

api.get<T>(endpoint)
api.post<T>(endpoint, body?)
api.put<T>(endpoint, body?)
api.patch<T>(endpoint, body?)
api.delete<T>(endpoint)
```

- 기본 URL: `config.apiBaseUrl` (`VITE_API_BASE_URL`)
- 모든 요청에 `Content-Type: application/json` 자동 포함
- `!res.ok` → `ApiError(status, message)` throw
- `204 No Content` → `undefined` 반환

## ApiError 처리

```ts
import { ApiError } from '@/services/api';

// TanStack Query onError
useMutation({
  mutationFn: ...,
  onError: (error) => {
    if (error instanceof ApiError) {
      if (error.status === 401) { /* 인증 만료 */ }
      if (error.status === 422) { /* 유효성 실패 */ }
    }
  },
});

// 컴포넌트에서 직접
const { error } = useQuery(...);
if (error instanceof ApiError && error.status === 404) { /* not found */ }
```

## OpenAPI 타입 (`src/types/api.ts`)

백엔드 API 스키마에서 자동 생성된 파일입니다. 직접 수정하지 마세요.

```ts
import type { components, paths } from '@/types/api';

// 스키마 타입
type User = components['schemas']['User'];
type Post = components['schemas']['Post'];

// 경로별 응답 타입
type GetUsersRes =
  paths['/users']['get']['responses']['200']['content']['application/json'];
```

### 재생성

```bash
openapi-typescript https://dev-api.hapalin.com/v3/api-docs -o src/types/api.ts
```

## 인증 헤더 추가

`api` 클라이언트는 `useAuthStore`의 `accessToken`을 자동으로 `Authorization: Bearer` 헤더에 주입합니다. 수동으로 넣지 마세요.

### 비회원 참여 토큰 (파티 참여 플로우)

로그인하지 않은 참여자는 `sessionStorage`에 저장된 참여 토큰을 `X-Participant-Token` 헤더로 전달합니다.

```ts
import { getParticipantOptions } from '@/utils/headers';

api.get('/parties/live', getParticipantOptions());
```

`getParticipantOptions()`는 로그인 상태면 `undefined`를 반환합니다(Bearer 인증 우선).
