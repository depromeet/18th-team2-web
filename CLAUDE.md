# CLAUDE.md — AI 어시스턴트 협업 규칙

이 파일은 Claude, Cursor 등 AI 도구가 이 레포에서 작업할 때 반드시 따라야 하는 규칙을 정의합니다.
코드를 생성하기 전에 이 파일을 먼저 읽으세요.

---

## 프로젝트 개요

- **스택**: React 18 + TypeScript + Vite (CSR, SSR 없음)
- **스타일링**: TailwindCSS v4
- **전역 상태**: Zustand v5
- **서버 상태**: TanStack Query v5
- **테스트**: Vitest + Testing Library
- **라우터**: React Router v6

---

## 폴더 구조

```
src/
├── assets/          # 정적 파일 (이미지, 폰트, SVG)
├── components/      # 공유/재사용 UI 컴포넌트
│   └── ui/          # 원시 UI 컴포넌트 (Button, Input, Modal 등)
├── config/          # 환경변수 및 앱 설정
├── constants/       # 앱 전역 상수
├── hooks/           # 커스텀 React 훅 (쿼리 훅 제외)
├── pages/           # 라우트 단위 페이지 컴포넌트
├── router/          # React Router 설정
├── services/        # API fetch 함수 + queryOptions
├── stores/          # Zustand 스토어
├── types/           # 공유 TypeScript 타입/인터페이스
└── utils/           # 순수 유틸리티 함수
```

**import alias**: `src/` 내부 import는 항상 `@/`를 사용합니다. 디렉터리 경계를 넘는 `../` 상대경로는 사용하지 않습니다.
alias는 `tsconfig.app.json`의 `paths`에서 한 곳만 정의하며, `vite-tsconfig-paths` 플러그인이 Vite/Vitest에 자동으로 적용합니다.

```ts
import { useAuthStore } from '@/stores/useAuthStore';
import { userQueries } from '@/services/user';
import { config } from '@/config/env';
import Button from '@/components/ui/Button';
```

---

## 코드 스타일 규칙

- 최상위 export 컴포넌트는 **named function declaration** 사용 (arrow function 지양)
- Props 인터페이스는 컴포넌트 위에 선언, `[ComponentName]Props`로 명명
- 타입 전용 import는 반드시 `import type` 사용 (ESLint에서 강제)
- commit 코드에 `console.log` 남기지 않기 — `console.warn` / `console.error`만 허용
- Tailwind 클래스 순서는 Prettier가 자동 정렬 (저장 시 자동 적용)

---

## 상태 관리 원칙

### Zustand — 클라이언트/전역 UI 상태
- 도메인별 1개 스토어 (예: `useAuthStore`, `useUIStore`)
- 항상 `devtools` 미들웨어로 감싸기
- 파일 위치: `src/stores/`
- **서버에서 받아온 데이터(API 응답)를 Zustand에 저장하지 않음**

### TanStack Query — 서버 상태
- **Hybrid 패턴**: `queryOptions` 팩토리 + custom hook 두 레이어로 분리
  - `src/services/[도메인].ts` — `queryOptions` 팩토리 (쿼리키 + 쿼리함수 공동 관리)
  - `src/hooks/use[도메인].ts` — `useQuery`를 감싼 custom hook (컴포넌트 진입점)
- 컴포넌트에서는 custom hook만 사용: `const { data } = useUsers();`
- invalidation/prefetch는 팩토리로 타입 안전하게: `queryClient.invalidateQueries(userQueries.all())`
- 쿼리키 배열 구조: `['도메인', ...params]`
- mutation은 custom hook 안에 `useMutation`으로 정의 (services에 두지 않음)
- **TanStack Query 캐시를 UI 상태 저장소로 사용하지 않음**

---

## 커밋 컨벤션 (Conventional Commits)

형식: `<type>(<scope>): <subject>`

| type | 사용 시점 |
|------|-----------|
| feat | 새로운 기능 |
| fix | 버그 수정 |
| chore | 빌드, 툴링, 패키지 (프로덕션 코드 변경 없음) |
| refactor | 동작 변경 없는 리팩터링 |
| style | 포매팅 변경 (세미콜론, 들여쓰기 등) |
| test | 테스트 추가/수정 |
| docs | 문서 변경 |
| ci | CI/CD 파이프라인 변경 |
| comment | 주석 추가/변경 |

예시:
```
feat(auth): 로그인 폼 및 유효성 검사 추가
fix(user): 모바일에서 프로필 이미지 로드 안 되는 문제 수정
chore: tanstack-query v5.56.2로 업그레이드
docs(adr): ADR-0003 상태 관리 문서 추가
```

---

## 브랜치 네이밍

```
main              ← 프로덕션
dev               ← 스테이징 / 통합
feat/#123         ← 기능 브랜치 (123 = GitHub 이슈 번호)
fix/#456          ← 버그 수정 브랜치
```

항상 `dev`에서 브랜치를 생성합니다. PR 대상은 `dev`입니다.
`dev` → `main`은 릴리즈 시 병합합니다.

---

## PR 규칙

- 최소 **1명 approve** 후 머지
- approve 받으면 본인 셀프 머지 허용
- PR당 최대 ~500줄 (초과 시 분할)
- 이슈 참조 필수: `Closes #123`

---

## 테스트 컨벤션

- 테스트 파일: 테스트 대상 파일과 동일 위치에 `*.test.tsx` / `*.test.ts`
- 컴포넌트 테스트: `@testing-library/react` 사용
- globals: `describe` / `it` / `expect` (vitest globals 활성화됨)
- API 모킹: `vi.mock()` 사용 (추후 MSW 도입 검토)
- 커버리지 목표: `src/services/`, `src/utils/` ≥ 70%

---

## AI가 하면 안 되는 것

- `any` 타입 사용 금지 → `unknown` 또는 정확한 타입 사용
- `useEffect`로 데이터 패칭 금지 → TanStack Query 사용
- `React.FC` 타입 사용 금지 → 명시적 props 인터페이스 + function declaration
- default export는 페이지 컴포넌트에만 허용
- `src/` 외부에 파일 생성 금지 (루트 설정 파일 제외)
- PR 설명 없이 새 의존성 추가 금지
- `console.log` commit 금지
