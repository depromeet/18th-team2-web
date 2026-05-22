export type PartyRole = 'host' | 'participant';

/** BE `partyOption` 값 그대로 — REALTIME: 실시간 파티, PAPER_ONLY: 롤링페이퍼 전용 */
export type PartyOption = 'REALTIME' | 'PAPER_ONLY';

export interface UpcomingParty {
  partyId?: string;
  /** BE `inviteToken` — 초대장 진입에 사용. 유효 토큰 없으면 undefined */
  inviteToken?: string;
  partyName: string;
  date: string;
  time?: string;
  endDate?: string;
  /** BE `host` 기반 */
  role: PartyRole;
  /** BE `partyOption` 기반 */
  partyOption: PartyOption;
  /** 시간 게이트 통과 여부 — REALTIME: 입장 가능 시각 지남 / PAPER_ONLY: 롤페 공개 시각 지남 */
  isOpen: boolean;
}
