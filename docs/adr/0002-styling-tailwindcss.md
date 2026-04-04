# ADR-0002: 스타일링 방식 — TailwindCSS v4

- **상태**: 승인됨 (Accepted)
- **날짜**: 2026-04-04
- **결정자**: 팀 전체

---

## 맥락 (Context)

컴포넌트 스타일링 방식을 결정해야 한다. CSS Modules, Emotion/styled-components(CSS-in-JS),
TailwindCSS가 주요 후보였다. 이전 레포(`18th-team2-web` 참조 레포)는 Emotion을 사용했으나,
새 프로젝트에서는 팀 합의하에 변경을 검토했다.

## 결정 (Decision)

TailwindCSS v4를 채택한다. Vite 플러그인(`@tailwindcss/vite`)을 통해 PostCSS 없이 통합한다.

## 근거 (Rationale)

- 유틸리티 클래스 방식으로 CSS 파일을 별도로 관리할 필요가 없어 파일 전환 비용이 없다.
- `prettier-plugin-tailwindcss`로 클래스 정렬을 자동화하여 코드 리뷰 잡음을 줄인다.
- v4에서는 `content` 스캔 설정 없이 자동 감지하여 설정 파일이 극도로 간소화된다.
- CSS-in-JS(Emotion, styled-components)는 런타임 오버헤드가 있고, SSR 미사용 시에도 번들 크기를 키운다.
- 디자인 토큰은 `@theme` 블록의 CSS 변수로 관리해 Figma 토큰과 동기화하기 용이하다.

## 결과 (Consequences)

### 긍정적 결과
- 스타일-로직 이동 시 `.css` 파일을 별도로 수정할 필요 없음
- 디자인 시스템 토큰이 CSS 변수로 자동 생성되어 런타임 접근 가능
- 빌드 시 사용하지 않는 클래스가 자동 제거되어 CSS 번들 최소화

### 부정적 결과 / 트레이드오프
- 클래스 문자열이 길어질 수 있음 → `clsx` / `cva` 도입으로 조건부 클래스 관리
- 팀원이 Tailwind 유틸리티 클래스명을 숙지해야 함 (초기 적응 기간 존재)
- 동적 클래스 생성(문자열 보간)은 PurgeCSS 오동작 유발 → 완전한 클래스명 사용 필수

## 대안 (Alternatives Considered)

| 대안 | 탈락 이유 |
|------|-----------|
| CSS Modules | 별도 파일 관리 오버헤드, 동적 스타일 불편 |
| Emotion (기존 레포 방식) | 런타임 오버헤드, TypeScript 설정 복잡, 팀 합의로 변경 결정 |
| styled-components | Emotion과 동일한 이유 |
| vanilla-extract | 학습 비용 높음, 생태계 작음 |
