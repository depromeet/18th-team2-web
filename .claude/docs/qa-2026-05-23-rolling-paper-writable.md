## QA 리포트 — 롤링페이퍼 "작성 가능 시간대" 로직

**날짜**: 2026-05-23
**범위**:
- `src/utils/date.ts` → `isFuture` (QA 당시 `src/services/rolling-paper.ts`의 `isRollingPaperWritable`. 순수 날짜 술어라 utils로 이동·제네릭화)
- `src/services/party-invite.ts` → `getRollingPaperWritableUntil`
- `src/components/party-ended/PartyEndedView.tsx` (버튼 분기)

**검증 방식**: 임시 테스트 29개로 분기/경계 전수 확인(대상 두 함수 branch coverage 100%) 후, 정책상 테스트 파일은 미보존 — 분석 결과만 이 문서로 남김.

---

### 해결 현황 (2026-05-23)

- **#1** (PAPER_ONLY 11시간 일찍 마감): **수용(A)** — PAPER_ONLY는 예약 이벤트가 아니라 날짜 단위로 충분, 정밀 마감은 시·분 데이터가 없어 BE 의존. 코드 변경 없음. BE가 PAPER_ONLY 정밀 `writableUntil` 제공 시 재검토.
- **#2** (partyEndDate 누락 시 Invalid Date): **수정 완료** — `if (!data.partyEndDate) throw` 가드 추가.
- **#3, #4**: 현 동작 유지(문서화만).

---

### 시나리오 결과

| #  | 시나리오 | 결과 | 비고 |
|----|---------|------|------|
| 1  | 골든: `isRollingPaperWritable` 미래 ISO/Date → true | PASS | KST 오프셋 포함 문자열 포함 |
| 2  | 골든: 과거 ISO/Date → false | PASS | |
| 3  | 엣지: null / undefined / `''` → false | PASS | falsy 가드에서 차단 |
| 4  | 엣지: writableUntil === now → false | PASS | `>` 비교라 동일 순간은 작성 불가 (의도 박제) |
| 5  | 엣지: now ±1ms 경계 | PASS | +1ms true, -1ms false |
| 6  | 엣지: `'not-a-date'` / Invalid Date / 공백 → false | PASS | NaN 비교로 조용히 false (이슈 #3) |
| 7  | 골든: REALTIME + liveStartAt → liveStartAt + 7일 (KST 정밀) | PASS | `2026-05-04T20:00` → `2026-05-11T11:00:00.000Z` |
| 8  | 엣지: REALTIME + realtimeSchedule=null → partyEndDate 폴백 | PASS | 정밀도 손실 (이슈 #1) |
| 9  | 엣지: REALTIME + liveStartAt=undefined → 폴백 | PASS | 이슈 #1 |
| 10 | 골든: PAPER_ONLY + partyEndDate → UTC 자정 파싱 | PASS | `2026-05-11` → `2026-05-11T00:00:00.000Z` |
| 11 | 엣지: partyEndDate undefined → Invalid Date 반환 | PASS | 헬퍼 단독은 무효 Date 방출 (이슈 #2) |
| 12 | 버그 박제: REALTIME vs PAPER_ONLY 11시간 정밀도 불일치 | PASS | 이슈 #1 |
| 13 | UI: writableUntil 미래 → "롤링페이퍼 작성하기" 버튼 + 작성 페이지 이동 | PASS | |
| 14 | UI: writableUntil 과거 → "홈으로" 버튼 + 홈 이동 | PASS | |
| 15 | UI 경계: writableUntil === now → 마감("홈으로") | PASS | 이슈 #4와 연결 |

---

### 발견된 이슈

#### 이슈 #1 — REALTIME과 PAPER_ONLY의 마감 시각 파싱 기준 불일치 (11시간 차)

- **심각도**: 중간
- **위치**: `src/services/party-invite.ts:28-35` (`getRollingPaperWritableUntil`)
- **증상**: 같은 캘린더 마감일("2026-05-11")이라도 파티 옵션에 따라 실제 마감 순간이 11시간 어긋난다.
  - REALTIME: `parseKstDateTime('2026-05-04T20:00:00').add(7,'day')` → `2026-05-11T11:00:00.000Z` (= KST 20:00)
  - PAPER_ONLY: `new Date('2026-05-11')` → `2026-05-11T00:00:00.000Z` (= KST 09:00)
  - 결과적으로 PAPER_ONLY 사용자는 같은 날짜인데도 KST 09:00에 일찍 마감된다. REALTIME 사용자는 같은 날 20:00까지 가능.
- **원인**: 두 경로의 파싱 기준이 다름.
  - REALTIME은 `parseKstDateTime`으로 "KST 벽시계" 해석.
  - PAPER_ONLY 폴백은 `new Date(dateString)` — ISO date-only 문자열을 **UTC 자정**으로 해석(JS 스펙). KST 변환을 거치지 않음.
- **재현/근거**: `party-invite.test.ts > [정밀도 불일치 버그 박제]` — `diffHours === 11` 로 단언하여 박제됨.
- **제안**: PAPER_ONLY 마감도 KST 기준으로 통일.
  예) `parseKstDateTime(`${partyEndDate}T23:59:59`).toDate()` 또는 `dayjs.tz(partyEndDate, 'Asia/Seoul').endOf('day').toDate()`.
  "date 단위 마감"의 정확한 마감 시각(자정/하루 끝)을 도메인 규칙으로 정의해야 함.

---

#### 이슈 #2 — `getRollingPaperWritableUntil`이 partyEndDate 누락 시 Invalid Date를 그대로 반환

- **심각도**: 중간 · **상태**: 수정 완료 (`if (!data.partyEndDate) throw` 가드 추가 — 무효 Date 대신 명시적 실패)
- **위치**: `src/services/party-invite.ts` — `getRollingPaperWritableUntil` 폴백 경로
- **증상**: `partyEndDate`가 `undefined`이고 REALTIME 정밀 경로도 못 타면 `new Date('')` = **Invalid Date**(`getTime()` NaN)를 반환한다.
- **원인**: `?? ''` 폴백이 빈 문자열을 `new Date()`에 넘기는데, `new Date('')`는 Invalid Date.
- **재현/근거**: `party-invite.test.ts > [이슈] partyEndDate 누락` 2케이스 — `Number.isNaN(result.getTime()) === true`.
- **영향**: 이 Invalid Date가 `isRollingPaperWritable`로 흐르면 `NaN > now` = false → "마감"으로 표시됨. 현재 호출부(`PartyEndedView` 등)가 우연히 마감 분기로 흡수해 크래시는 없으나, 데이터 누락과 정상 마감이 구분 불가. 다른 호출부(`formatKoreanShortDate(writableUntil)` 등 날짜 포맷)에 직접 넘기면 "Invalid Date" 출력 위험.
- **제안**: 헬퍼가 무효 입력에 대해 명시적으로 처리(예: `null` 반환 후 호출부 타입을 `Date | null`로) 하거나, 상위에서 `partyEndDate` 존재를 보장. 최소한 `new Date('')` 대신 의도를 드러내는 가드 추가.

---

#### 이슈 #3 — `isRollingPaperWritable`이 무효 문자열을 조용히 "작성 불가"로 삼킴

- **심각도**: 낮음 · **상태**: 현 동작 유지(문서화)
- **위치**: `src/utils/date.ts` → `isFuture` (QA 당시 `src/services/rolling-paper.ts`의 `isRollingPaperWritable`)
- **증상**: `'not-a-date'`, 공백 문자열 `'   '`, Invalid Date 객체 모두 `false` 반환. 유효한 마감과 데이터 오류를 호출부가 구분할 수 없다.
- **원인**: `new Date('not-a-date').getTime()` = NaN, `NaN > Date.now()` = false. 별도 유효성 검사 없음. (참고: `''`는 첫 줄 `if (!writableUntil)` falsy 가드에서 먼저 차단되어 같은 false지만 경로가 다름.)
- **재현/근거**: `rolling-paper.test.ts > 무효 입력 (조용히 false로 삼킴)` 3케이스.
- **제안**: 현 동작이 "안전한 기본값(작성 불가)"으로는 합리적이나, 무효 입력은 명시적으로 감지/로깅하는 편이 디버깅에 유리. 최소한 JSDoc에 "무효 입력 = 작성 불가로 간주" 명문화 권장. (이슈 #2의 Invalid Date가 여기로 흘러도 같은 이유로 조용히 false가 되는 연쇄 주의.)

---

#### 이슈 #4 — 경계: writableUntil === now 는 작성 불가 (`>` 비교)

- **심각도**: 낮음 (정책 확인 필요)
- **위치**: `src/services/rolling-paper.ts:38` — `... > Date.now()`
- **증상**: 마감 시각과 정확히 동일한 ms에는 작성이 불가능(false).
- **원인**: 엄격 비교 `>` 사용. 마감 시각 "정각"은 이미 마감으로 처리.
- **재현/근거**: `rolling-paper.test.ts > 경계값 > writableUntil === now → false`, `PartyEndedView.test.tsx > [경계] writableUntil === now → "홈으로"`.
- **제안**: 의도된 동작으로 보임(마감 시각 = 더 이상 작성 불가). 단 "마감 시각 정각까지 허용"이 정책이라면 `>=`로 변경 필요. 현재 동작을 테스트로 박제했으므로 정책 변경 시 테스트가 깨지며 명시적으로 드러남.

---

### 비고 (테스트 인프라)

- 대상 서비스 파일이 트랜지티브하게 `@/services/api` → `@/config/env`를 로드하면서 `VITE_API_BASE_URL` 환경변수를 요구해 테스트 수집 단계에서 전부 실패했다. 검증 대상은 순수 함수이므로 각 테스트 파일 상단에서 `vi.mock('@/services/api', ...)`로 차단해 해결. (vitest는 `.env`를 자동 노출하지 않음 — 추후 다른 서비스 테스트에서도 동일 패턴 필요.)
- 컴포넌트 클릭 테스트는 `vi.useFakeTimers()`와 `userEvent.setup()`이 상호 대기하며 타임아웃되어 `fireEvent.click`(동기)으로 전환. 현 시각 고정(`Date.now()`)을 위해 fake timers는 유지해야 하므로 의도적 선택.

---

**총평**: 4개 이슈 발견 (중간 2 / 낮음 2). 핵심은 **이슈 #1 — REALTIME(KST 벽시계)과 PAPER_ONLY(UTC 자정)의 마감 시각이 11시간 어긋나는 정밀도 불일치**로, 사용자 체감 마감 시각이 옵션별로 달라지는 도메인 정합성 문제. 모든 동작은 회귀 방지용으로 테스트에 박제됨.
