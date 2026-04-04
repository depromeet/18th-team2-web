# ADR-0006: 브랜치 전략 — 3-tier (main / dev / feat)

- **상태**: 승인됨 (Accepted)
- **날짜**: 2026-04-04
- **결정자**: 팀 전체

---

## 맥락 (Context)

팀 협업에서 브랜치 전략이 없으면 충돌과 의도치 않은 프로덕션 배포가 발생한다.
Git Flow는 release, hotfix 브랜치 등 너무 복잡하고, Trunk Based Development는
강력한 CI/CD와 feature flag 인프라가 필요하다.
팀 규모(소수)와 프로젝트 초기 단계를 고려해 단순하고 명확한 전략이 필요하다.

## 결정 (Decision)

3단계 브랜치 전략을 사용한다.

```
main              ← 프로덕션 배포 대상 (항상 배포 가능한 상태 유지)
 └── dev          ← 스테이징/통합 브랜치 (백엔드 스테이징 서버와 연결)
      └── feat/#이슈번호   ← 기능 개발 브랜치
      └── fix/#이슈번호    ← 버그 수정 브랜치
      └── docs/#이슈번호   ← 문서 수정 브랜치
      └── refactor/#이슈번호 ← 리팩터링 브랜치
      └── chore/#이슈번호  ← 설정/도구 변경 브랜치
```

### 워크플로우

1. GitHub에서 이슈 생성 → 이슈 번호 확인
2. `dev` 브랜치에서 `feat/#이슈번호` 브랜치 생성
3. 작업 완료 후 `dev`로 PR 생성 (`Closes #이슈번호` 포함)
4. 최소 1명 approve → 본인 셀프 머지
5. 배포 시 `dev` → `main` PR 생성 후 머지

### PR 규칙
- 최소 1명 approve 후 머지 허용 (본인 셀프 머지 가능)
- PR당 최대 ~500줄 (초과 시 분할 권장)
- PR 제목: Conventional Commits 형식 준수
- CodeRabbit AI 리뷰 자동 활성화

## 근거 (Rationale)

- `dev` 브랜치가 통합 버퍼 역할을 하여 `main` 오염 방지
- 이슈 번호 기반 브랜치명으로 작업 추적성 확보
- 자기 머지 허용으로 팀 속도 유지 (approve 조건 충족 시)
- 일주일 단위 스프린트와 맞게 `dev` → `main` 주기적 릴리즈

## 스프린트 운영

- 스프린트 시작 전: 이번 주 작업 이슈 등록
- Assignee: 본인 지정 필수
- 슬랙봇으로 PR 알림 연동 (미리뷰 후 재촉 가능)

## 결과 (Consequences)

### 긍정적 결과
- 프로덕션(`main`)과 개발(`dev`) 환경 명확히 분리
- 이슈-브랜치-PR 연결로 작업 추적 용이
- 배포 전 `dev`에서 통합 테스트 가능

### 부정적 결과 / 트레이드오프
- `dev` 브랜치가 지속적으로 최신 상태를 유지해야 함
- 장기 feature 브랜치는 `dev`와 주기적 동기화(rebase/merge) 필요

## 대안 (Alternatives Considered)

| 대안 | 탈락 이유 |
|------|-----------|
| Git Flow (develop/release/hotfix) | 소규모 팀에 과도하게 복잡, 릴리즈 브랜치 불필요 |
| Trunk Based Development | feature flag 인프라 필요, CI/CD 성숙도 요구 |
| GitHub Flow (main만 사용) | 스테이징 환경 분리 불가, 백엔드 스테이징 서버 연동 어려움 |
