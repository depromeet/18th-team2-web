# ADR-0004: 폴더 구조 — 전통적 역할 기반 구조

- **상태**: 승인됨 (Accepted)
- **날짜**: 2026-04-04
- **결정자**: 팀 전체

---

## 맥락 (Context)

대규모 프로젝트에서는 FSD(Feature-Sliced Design) 같은 도메인 기반 구조가 유지보수에 유리하다.
그러나 구조를 선택할 때는 팀 규모, 프로젝트 초기 복잡도, 학습 비용을 함께 고려해야 한다.
이 프로젝트는 인원이 소수이고, 초기 단계라 도메인 경계가 아직 유동적이다.

## 결정 (Decision)

전통적 역할 기반 폴더 구조(role-based)를 채택하고, `@/` import alias로 경로를 단순화한다.
FSD는 채택하지 않는다.

alias는 `tsconfig.app.json`의 `paths`에서만 정의하고, `vite-tsconfig-paths` 플러그인으로
Vite/Vitest 설정에 자동 동기화한다. (중복 정의 없음)

```
src/
├── assets/          # 정적 파일 (이미지, 폰트, SVG)
├── components/      # 공유/재사용 UI 컴포넌트
│   └── ui/          # 원시 UI 컴포넌트 (Button, Input, Modal 등)
├── config/          # 환경변수 및 앱 설정
├── constants/       # 앱 전역 상수
├── hooks/           # 커스텀 React 훅
├── pages/           # 라우트 단위 페이지 컴포넌트
├── router/          # React Router 설정
├── services/        # API fetch 함수 + queryOptions
├── stores/          # Zustand 스토어
├── types/           # 공유 TypeScript 타입/인터페이스
└── utils/           # 순수 유틸리티 함수
```

## 근거 (Rationale)

- 팀원 모두에게 익숙한 구조로 온보딩 비용 최소화
- FSD는 팀이 도메인 경계를 미리 명확히 정의해야 하는 사전 조건이 있음
- 초기 단계에서 도메인이 유동적이므로 역할 기반이 더 유연함
- `index.ts` barrel 파일보다 `@/` alias로 직접 경로를 명시하는 것이 IDE 추적에 더 명확함
- 프로젝트가 성장하면 `pages/` 내에 도메인 하위 폴더를 추가해 점진적으로 확장 가능

## 결과 (Consequences)

### 긍정적 결과
- 즉시 작업 시작 가능, 구조 학습 비용 없음
- 어디에 무엇을 두어야 할지 명확
- 새 팀원 온보딩 시 폴더 구조 설명이 간단함

### 부정적 결과 / 트레이드오프
- 프로젝트 규모가 커지면 `components/`와 `hooks/`가 비대해질 수 있음
  → 이 경우 `components/[도메인]/` 하위 폴더로 분리
- 도메인 간 의존성 경계가 FSD만큼 명시적이지 않음
  → ESLint import 규칙으로 보완 가능

## 대안 (Alternatives Considered)

| 대안 | 탈락 이유 |
|------|-----------|
| FSD (Feature-Sliced Design) | 팀 학습 비용 높음, 초기 단계에서 오버엔지니어링 우려, 도메인 경계 불명확 |
| 모노레포 (Turborepo) | 단일 웹 앱이므로 현재 불필요 |
| pages/ 라우터 파일 기반 구조 | 라우팅 라이브러리와의 의존성 결합 우려 |
