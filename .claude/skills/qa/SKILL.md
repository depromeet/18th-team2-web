---
name: qa
description: 기능의 동작을 시나리오 기반으로 검증하고 QA 이슈를 리포트합니다.
---

qa-engineer 에이전트를 사용해 대상 기능의 동작을 검증합니다.

다음 순서로 실행하세요:

1. 검증 대상 기능과 관련 파일 파악 (컴포넌트, 서비스, 스토어)
2. 골든 패스 → 엣지 케이스 → 에러 시나리오 순서로 검증
3. API 호출 흐름 추적 (`src/services/` → `api.ts`)
4. UI 상태 전환 검토 (loading / success / error / empty)
5. `.claude/skills/qa/templates/output.md` 형식으로 출력

이슈가 발견되면 `.claude/docs/`에 `qa-YYYY-MM-DD-{기능명}.md`로 저장합니다.
