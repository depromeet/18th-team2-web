# ADR-0005: 테스트 전략 — Vitest

- **상태**: 승인됨 (Accepted)
- **날짜**: 2026-04-04
- **결정자**: 팀 전체

---

## 맥락 (Context)

Vite 기반 프로젝트에서 Jest를 사용하면 ESM 모듈 처리와 TypeScript 트랜스파일을 위해
별도의 Babel 설정이 필요하다. 또한 Jest는 CommonJS 기반이라 Vite의 ESM 환경과 불일치가 발생한다.
팀에서는 단위 테스트와 컴포넌트 테스트를 모두 커버할 수 있는 단일 솔루션을 원했다.

## 결정 (Decision)

**Vitest + @testing-library/react**를 채택한다.

- **단위 테스트 / 컴포넌트 테스트**: `vitest` + `jsdom` 환경
- **E2E 테스트**: 현재 범위 외 (추후 Playwright 도입 검토)

테스트 파일은 대상 파일과 동일 위치에 배치: `Foo.tsx` → `Foo.test.tsx`

## 근거 (Rationale)

- Vitest는 Vite 설정을 공유하므로 `@/` alias 등 별도 트랜스파일 설정이 불필요하다.
- Jest 호환 API(`describe`, `it`, `expect`, `vi.mock()`)를 제공하여 기존 Jest 경험을 그대로 활용 가능하다.
- `@vitest/ui`로 브라우저 기반 테스트 결과를 시각적으로 확인할 수 있다.
- `@vitest/coverage-v8`으로 V8 native coverage를 수집해 별도 Istanbul 설정이 필요 없다.
- Watch 모드가 기본이라 TDD 개발 흐름에 적합하다.

## 결과 (Consequences)

### 긍정적 결과
- Vite와 동일한 변환 파이프라인 사용 → 설정 불일치 없음
- Jest 대비 빠른 테스트 실행 속도
- TypeScript path alias (`@/`) 별도 설정 없이 동작
- 단일 설정 파일(`vitest.config.ts`)로 관리 가능

### 부정적 결과 / 트레이드오프
- Jest 생태계 일부 플러그인과 비호환 가능성 (대부분 Vitest 호환 버전 존재)
- jsdom은 실제 브라우저 환경과 완전히 동일하지 않음 → E2E는 별도 도구 필요

## 커버리지 목표

| 대상 | 목표 |
|------|------|
| `src/services/` | ≥ 70% |
| `src/utils/` | ≥ 70% |
| `src/components/ui/` | 주요 인터랙션 커버 |
| `src/pages/` | 스모크 테스트 수준 |

## 대안 (Alternatives Considered)

| 대안 | 탈락 이유 |
|------|-----------|
| Jest | Vite ESM 불일치, Babel 설정 필요, 상대적으로 느린 속도 |
| Playwright Component Test | 설정 복잡도 높음, 단위 테스트 용도로는 과도 |
| Testing Library + Jest (CRA 기본) | CRA 유지보수 중단, Jest의 Vite 비호환 문제 |
