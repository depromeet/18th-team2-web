---
name: create-pr
description: 현재 브랜치의 변경사항을 기반으로 PR을 생성합니다.
---

현재 브랜치의 변경사항을 분석해 PR을 생성합니다.

다음 순서로 실행하세요:

1. `git status`, `git log dev...HEAD`, `git diff dev...HEAD` 확인
2. 변경 내용 요약 (기능, 수정, 의존성 변경 등)
3. 커밋 컨벤션 확인 (`feat`, `fix`, `chore` 등)
4. PR 제목: `<type>(<scope>): <subject>` 형식 (70자 이내)
5. `gh pr create`로 PR 생성, 대상 브랜치는 `dev`

PR 본문 형식:

```
## 변경 사항
- 변경 내용 bullet

## 테스트
- [ ] 골든 패스 동작 확인
- [ ] 에러 케이스 처리 확인
- [ ] 모바일 레이아웃 확인

Closes #이슈번호
```

이슈 번호가 없으면 `Closes #` 줄을 생략합니다.
