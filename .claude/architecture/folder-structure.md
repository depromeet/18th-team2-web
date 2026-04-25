# 폴더 구조

## src/ 디렉터리

```
src/
├── assets/          # 정적 파일 (이미지, 폰트, SVG)
├── components/
│   ├── layout/      # 레이아웃 컴포넌트 (MobileLayout 등)
│   └── ui/          # 재사용 원시 UI (Button, Input, Typography 등)
├── config/          # 환경변수 래퍼 (env.ts)
├── constants/       # 앱 전역 상수
├── hooks/           # 순수 클라이언트 훅 (useDebounce, useMediaQuery 등)
├── pages/           # 라우트 단위 페이지 컴포넌트
├── router/          # React Router 설정
├── services/        # API 호출 + queryOptions + query/mutation 훅 (도메인별)
├── stores/          # Zustand 스토어 (도메인별)
├── styles/
│   └── tokens.css   # Tailwind v4 디자인 토큰 (@theme)
├── test/            # 테스트 전역 설정 (setup.ts)
├── types/
│   ├── api.ts       # openapi-typescript 자동 생성 (수동 편집 금지)
│   └── *.ts         # 공유 TypeScript 타입/인터페이스
└── utils/           # 순수 유틸리티 함수
```

## 파일 배치 결정 기준

```
새 파일을 어디에 둘까?

API 호출이 있다         →  src/services/[도메인].ts
전역 UI/클라이언트 상태  →  src/stores/use[Domain]Store.ts
서버와 무관한 훅        →  src/hooks/use[Name].ts
여러 페이지에서 쓰는 UI  →  src/components/ui/[Name].tsx
레이아웃 래퍼           →  src/components/layout/[Name].tsx
라우트 진입점           →  src/pages/[Name]Page.tsx
공유 타입               →  src/types/[domain].ts
앱 전역 상수            →  src/constants/[domain].ts
순수 함수 유틸          →  src/utils/[domain].ts
```

## Import Alias

`src/` 내부 import는 항상 `@/`를 사용합니다.
디렉터리 경계를 넘는 `../` 상대경로는 사용하지 않습니다.

```ts
// ✅
import { useAuthStore } from '@/stores/useAuthStore';
import { userQueries } from '@/services/user';
import { config } from '@/config/env';
import { Button } from '@/components/ui/Button';

// ❌
import { Button } from '../../components/ui/Button';
```

alias는 `tsconfig.app.json`의 `paths`에서 정의하며, `vite-tsconfig-paths` 플러그인이 Vite/Vitest에 자동 적용합니다.

## 환경변수

`src/config/env.ts`의 `config` 객체를 통해서만 접근합니다. `import.meta.env`를 컴포넌트에서 직접 사용하지 않습니다.

```ts
import { config } from '@/config/env';

config.apiBaseUrl  // VITE_API_BASE_URL
config.appEnv      // VITE_APP_ENV
```

필수 변수 누락 시 `config`가 런타임 에러를 throw합니다. `.env.example`을 복사해 `.env`를 만드세요.
