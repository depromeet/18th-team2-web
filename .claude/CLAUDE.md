# CLAUDE.md

이 문서는 Claude Code가 이 저장소에서 작업할 때 참고하는 인덱스입니다. 상세 내용은 각 링크된 문서를 확인하세요.

## 작업 원칙

- **작업 지침**: [.claude/guidelines/workflow.md](.claude/guidelines/workflow.md) — 제안 먼저/승인 후 실행, 근거 제시, 스킬 제안 기준
- 한국어로 응답합니다.

## 아키텍처 & 컨벤션

- **폴더 구조**: [.claude/architecture/folder-structure.md](.claude/architecture/folder-structure.md)
- **컨벤션**: [.claude/conventions/](.claude/conventions/)
  - [naming.md](.claude/conventions/naming.md) · [code-style.md](.claude/conventions/code-style.md) · [styling.md](.claude/conventions/styling.md)
  - [react-patterns.md](.claude/conventions/react-patterns.md) · [component-patterns.md](.claude/conventions/component-patterns.md)
  - [state-management.md](.claude/conventions/state-management.md) · [api-patterns.md](.claude/conventions/api-patterns.md) · [routing.md](.claude/conventions/routing.md)

## 스킬 (slash commands)

| 스킬 | 용도 |
| --- | --- |
| `/review` | 변경사항 코드 리뷰 |
| `/qa` | 기능 동작 검증 |
| `/create-pr` | PR 생성 |

## 에이전트

[.claude/agents/](.claude/agents/) — `code-reviewer`, `qa-engineer`

## 문서 산출물

[.claude/docs/README.md](.claude/docs/README.md) — ADR, QA 이슈, 리서치 보고서의 파일명 규칙과 저장 위치
