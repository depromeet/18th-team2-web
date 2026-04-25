# 스타일링

## 디자인 토큰

토큰은 `src/styles/tokens.css`에 정의되어 있습니다. Tailwind v4 `@theme` 방식입니다.

### 컬러

```
grey: 30 · 50 · 100 · 200 · 300 · 400 · 500 · 600 · 700 · 800 · 900
blue: 30 · 50 · 100 · 200 · 300 · 400 · 500* · 600 · 700 · 800 · 900
red:  30 · 50 · 100 · 200 · 300 · 400 · 500* · 600 · 700 · 800 · 900
yellow: 30 · 50 · 100 · 200 · 300 · 400 · 500* · 600 · 700 · 800 · 900
white / black
```

`*` = 기본 브랜드 컬러

```tsx
<div className="bg-blue-500 text-white" />
<p className="text-grey-600" />
<span className="text-red-500" />
```

### 타이포그래피 스케일

`text-{name}` 유틸리티는 font-size + line-height를 동시에 적용합니다.

| 유틸 클래스 | 크기 | 줄간격 | 기본 웨이트 |
| --- | --- | --- | --- |
| `text-title-1` | 36px | 48px | bold |
| `text-title-2` | 32px | 42px | bold |
| `text-title-3` | 28px | 38px | bold |
| `text-title-4` | 24px | 32px | bold |
| `text-head-1` | 22px | 30px | semibold |
| `text-head-2` | 20px | 28px | semibold |
| `text-head-3` | 18px | 26px | semibold |
| `text-head-4` | 17px | 24px | semibold |
| `text-body-1` | 16px | 24px | — |
| `text-body-2` | 15px | 22px | — |
| `text-label-1` | 14px | 20px | medium |
| `text-label-2` | 13px | 18px | medium |
| `text-caption-1` | 12px | 16px | — |

## 타이포그래피 컴포넌트

`src/components/ui/Typography.tsx`를 사용합니다.
`as` prop으로 렌더 태그를 변경할 수 있습니다.

```tsx
import { T1, T2, T3, T4, H1, H2, H3, H4, B1, B2, L1, L2, Caption } from '@/components/ui/Typography';

// 기본 사용
<T1>제목</T1>                    // h1, 36px bold
<H1>서브헤딩</H1>                // h5, 22px semibold
<B1>본문</B1>                    // p, 16px
<L1>라벨</L1>                    // span, 14px medium
<Caption>캡션</Caption>          // span, 12px

// 태그 변경
<T1 as="p">p 태그로 렌더</T1>
<B1 as="span">인라인 본문</B1>

// 색상·웨이트 오버라이드
<T2 className="text-blue-500">파란 소제목</T2>
<B1 className="font-medium text-grey-600">중간 굵기 본문</B1>
```

## HTML 기본 태그 자동 스타일

`@layer base`에 h1~h6, p 기본 스타일이 적용되어 있습니다.

| 태그 | 적용 스타일 |
| --- | --- |
| `<h1>` | title-1 (36px) bold |
| `<h2>` | title-2 (32px) bold |
| `<h3>` | title-3 (28px) bold |
| `<h4>` | title-4 (24px) bold |
| `<h5>` | head-1 (22px) semibold |
| `<h6>` | head-2 (20px) semibold |
| `<p>` | body-1 (16px) |

## Tailwind 사용 원칙

- 클래스 순서는 Prettier가 자동 정렬합니다 (저장 시 적용).
- 임의값(`text-[14px]`)보다 토큰 유틸을 우선 사용합니다.
- 반응형 불필요 — 모바일 고정 레이아웃 (`max-w-[430px]`).
