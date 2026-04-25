---
name: create-pr
description: 현재 브랜치의 변경사항을 기반으로 PR을 생성합니다.
---

현재 브랜치의 변경사항을 분석해 PR을 생성합니다.

다음 순서로 실행하세요:

1. `git status`, `git log dev...HEAD`, `git diff dev...HEAD` 확인
2. 변경 내용 요약 (기능, 수정, 의존성 변경 등)
3. 커밋 컨벤션으로 변경 유형 파악 (`feat`, `fix`, `chore` 등)
4. PR 제목: `<type>(<scope>): <subject>` 형식 (70자 이내)
5. `.github/pull_request_template.md`를 본문으로 사용해 `gh pr create` 실행, 대상 브랜치는 `dev`

본문 작성 규칙:
- **📌 작업 내용**: 변경사항을 bullet로 채우고, 이슈 번호가 있으면 `Closes #번호` 추가
- **변경 유형**: 해당 항목만 `[x]`로 체크
- **🤔 고민했던 부분**: 실제 고민 포인트가 없으면 섹션 삭제
- **🔊 도움이 필요한 부분**: 없으면 섹션 삭제
- **체크리스트**: 모든 항목 `[x]`로 체크 (사용자가 직접 확인할 항목임을 안내)
