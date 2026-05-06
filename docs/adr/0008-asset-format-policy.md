# ADR-0008: 자산 형식 정책 — 작은 아이콘은 SVG+SVGR, 복잡 일러스트는 PNG

- **상태**: 승인됨 (Accepted)
- **날짜**: 2026-05-05
- **결정자**: 민수

---

## 맥락 (Context)

PR #40 머지 후 자산 사용이 두 패턴으로 혼재했다.

- 작은 아이콘 (Chevron, Close, Check 등): `.tsx` 파일에 인라인 `<svg>` JSX로 작성
- 보관함 우표 5종: `.svg` 파일을 URL import (`import url from '...svg'`)
- 그 외 페이지(`PartyTypePage`, `PartyCharacterSelectPage`, `StackedInvitationBackdrop`, `LinkShareSheet`)도 페이지/컴포넌트 본문에 인라인 SVG 직접 작성

문제점:

- 디자이너가 svg 파일을 받아도 코드에 박혀 있어 직접 교체 불가
- 같은 chevron이 4가지 (`ChevronLeftIcon`, `ChevronRightIcon`, `ChevronSmallIcon`, `PartyCharacterSelectPage` 내부 `ChevronIcon`)로 분산
- 보관함 우표(strawberry/candle/firework/rollcake/donut) 5종은 filter/gradient/blur가 복잡해 SVG inline 시 시각이 디자이너 시안과 미묘하게 달라짐 (Figma vs Chrome 렌더 차이)

## 결정 (Decision)

### 1. 사용 형식 선택 기준

| 자산 종류 | 형식 | 사용 방법 |
|---|---|---|
| 작은 아이콘 (24×24 이내, 단순 path) | **SVG + SVGR** | `?react` query string으로 React component import |
| 복잡 일러스트 (filter/gradient/blur, 100KB+ inline) | **PNG / WebP** | URL import (`import x from '...png'`) |
| 정적 배경/장식용 SVG (gradient defs 포함) | SVG + SVGR | 색상이 동적이지 않으면 SVG가 작음 (300B 수준) |

### 2. SVGR 도입

- `vite-plugin-svgr@^5` 사용
- `vite.config.ts` plugin 등록, `vite-env.d.ts`에 `/// <reference types="vite-plugin-svgr/client" />`
- import: `import Icon from '@/assets/images/icons/x.svg?react'`

### 3. SVG 파일 작성 규칙

```svg
<!-- ✅ 권장 -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="...">
  <path d="..." stroke="currentColor" stroke-width="2" stroke-linecap="round" />
</svg>
```

- `stroke`/`fill` 색상이 동적이어야 하면 **`currentColor`** 사용 → 호출 측에서 `className="text-grey-500"`로 색상 결정
- 색상이 항상 고정이면 hex 그대로 (예: `check-circle-filled.svg`의 `#5892ff`)
- `width`/`height`는 호출 측 `<Icon width={16} height={16} />` props로 오버라이드 가능

### 4. 폴더 구조

```
src/assets/images/
├── icons/        ← 작은 아이콘 (SVG + SVGR)
│   ├── chevron-left.svg
│   ├── chevron-right.svg
│   ├── close.svg
│   ├── check.svg
│   ├── check-circle-filled.svg
│   └── invitation-backdrop.svg
└── stamps/       ← 복잡 일러스트 (PNG)
    ├── stamp-strawberry-long.png
    ├── stamp-candle-long.png
    └── ...

src/components/ui/icons/
├── ChevronLeftIcon.tsx     ← `?react` re-export wrapper
├── ChevronRightIcon.tsx
├── CloseIcon.tsx
└── CheckIcon.tsx
```

- SVG 파일 자체는 `assets/images/icons/`에 둠
- 자주 쓰는 아이콘은 `components/ui/icons/`에 wrapper 컴포넌트로 한 번 더 export (호출 측이 svg path 의식 안 하도록)

### 5. 같은 모양 중복 금지

- `ChevronLeft` + 90° 회전으로 `ChevronUp`/`Down` 만들지 말고 별도 svg
- `width={16} height={16}` props로 ChevronSmall 대체 가능하면 별도 컴포넌트 만들지 않음

## 근거 (Rationale)

### 큰 일러스트는 PNG가 적합한 이유
- 보관함 우표 5종은 filter blur, radial gradient, opacity 다중 레이어 → SVG inline 렌더 시 브라우저별 미묘한 차이
- PNG는 디자이너가 Figma에서 정확히 export → 시안과 100% 일치
- 파일 크기도 비슷하거나 PNG가 더 작음 (인라인 SVG 800줄+ vs PNG 50KB)

### 작은 아이콘은 SVG가 적합한 이유
- 24×24 이내 단순 path → SVG 수십 줄, 매우 작음
- 색상을 `currentColor`로 두면 React `className`/Tailwind 토큰으로 동적 변경 가능
- 디자이너가 `.svg` 파일 직접 교체 가능 (자산 분리)

### SVGR(`?react`) 선택 이유
- `import url from '...svg'`는 `<img src={url}>`로만 사용 가능 → 색상/크기 props로 못 줌
- SVGR은 `?react` query로 import 시 React component → `<Icon className="text-blue-500" width={16} />` 가능
- vite-plugin-svgr v5는 query string 기반이라 기존 URL import와 공존 가능 (점진 적용)

## 결과 (Consequences)

### 긍정적 결과
- 디자이너가 자산 파일 직접 교체 가능
- 아이콘 색상/크기를 호출 측에서 자유롭게 조정
- 인라인 SVG `.tsx` 사라져 컴포넌트 본문이 짧아짐
- chevron 4종 분산 → 2종으로 통합 (`ChevronLeftIcon`/`RightIcon` + size props)

### 부정적 결과 / 트레이드오프
- SVGR svgo 변환 과정에서 attribute가 미묘하게 달라질 수 있어 복잡 SVG는 inline 결과를 시안과 비교 검증 필요
- 자산 파일이 늘어나 `src/assets/images/icons/` 관리 필요

## 대안 (Alternatives Considered)

| 대안 | 탈락 이유 |
|---|---|
| 모든 SVG를 인라인 `.tsx`로 통일 | 디자이너 자산 교체 불가, 색상/크기 props 줄 수 있지만 매번 `<svg>` JSX 작성 부담 |
| 모든 자산을 PNG로 통일 | 작은 아이콘은 SVG가 더 작고 색상 동적 변경 유리 |
| SVG sprite (`<symbol>` + `<use>`) | id 충돌 위험, 빌드 파이프라인 복잡, SVGR 대비 이점 없음 |
| 인라인 SVG + 함수 컴포넌트 그대로 유지 | 자산 분리 안 됨, 디자이너 워크플로우 미흡 |
