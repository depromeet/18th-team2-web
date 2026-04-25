---
name: review
description: 현재 브랜치 변경사항을 프로젝트 컨벤션 기준으로 코드 리뷰합니다.
---

code-reviewer 에이전트를 사용해 현재 브랜치의 변경사항을 리뷰합니다.

다음 순서로 실행하세요:

1. `git diff dev...HEAD`로 변경 파일 목록 확인
2. 변경된 파일 전체 읽기
3. `.claude/agents/code-reviewer.md` 기준으로 리뷰 수행
4. `.claude/skills/review/templates/output.md` 형식으로 출력
