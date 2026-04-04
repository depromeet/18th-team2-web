# ADR-0001: 프레임워크 선택 — React + TypeScript + Vite (CSR)

- **상태**: 승인됨 (Accepted)
- **날짜**: 2026-04-04
- **결정자**: 팀 전체

---

## 맥락 (Context)

새 웹 프로젝트의 프레임워크를 결정해야 한다. 주요 후보는 Next.js(SSR/SSG 지원)와
React + Vite(CSR 전용) 두 가지였다. 우리 서비스가 SSR이 꼭 필요한지, 팀의 학습 비용 대비
생산성이 어느 쪽이 유리한지를 기준으로 판단했다.

## 결정 (Decision)

React 18 + TypeScript + Vite를 CSR(Client-Side Rendering) 구성으로 채택한다.

## 근거 (Rationale)

- 현재 서비스는 인증 기반이며, SEO가 핵심 요구사항이 아니다.
- 팀 전체가 Next.js App Router 특유의 서버 컴포넌트/라우팅 패턴에 익숙하지 않아 학습 비용이 높다.
- CSR로 충분한 요구사항에 SSR 프레임워크를 도입하는 것은 오버엔지니어링이다.
- Vite는 HMR 속도가 빠르고 설정이 단순해 개발 생산성이 높다.
- 추후 SSR이 필요해지면 Next.js 또는 TanStack Start으로 마이그레이션 가능한 구조를 유지한다.

## 결과 (Consequences)

### 긍정적 결과
- 빠른 개발 환경 시작 및 간단한 설정
- 팀 전체의 낮은 학습 곡선
- 번들 크기 최적화가 용이 (Vite + Rollup 기반)

### 부정적 결과 / 트레이드오프
- 초기 HTML이 비어 있어 SEO에 불리함 → 필요시 `vite-plugin-prerender` 도입 검토
- 소셜 공유용 og:tags는 서버 사이드 처리 없이 동적 설정 불가 → API 서버에서 처리 필요

## 대안 (Alternatives Considered)

| 대안 | 탈락 이유 |
|------|-----------|
| Next.js App Router | 학습 비용 높음, SSR 불필요한 현재 요구사항에 과도함 |
| Remix | 팀 친숙도 낮음, 생태계 상대적으로 작음 |
| TanStack Start | 2025년 기준 프로덕션 안정성 미검증 |
| Create React App | 유지보수 중단됨 |
