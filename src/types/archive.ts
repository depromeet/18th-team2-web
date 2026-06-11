import type { PartyRole } from '@/constants/party';

export type ArchiveItemType = 'PARTY' | 'PAPER';
export type StampType = 'strawberry' | 'candle' | 'firework' | 'rollcake' | 'donut';

export interface ArchiveListItem {
  /** 항목 ID (participant.id) */
  id: string;
  /** 상세 조회용 파티 ID */
  partyId: string;
  type: ArchiveItemType;
  /** 표시용 제목 — BE 제목 필드 없음, celebrantName + type으로 FE 조합 ("{주인공}의 파티/롤링페이퍼") */
  title: string;
  date: string;
  /** "내가 만든 파티" 필터용 — 본인 역할(HOST/PARTICIPANT) */
  role: PartyRole;
}

export interface ChatMessage {
  id: string;
  authorName: string;
  content: string;
  sentAt: string;
}

// PARTY/PAPER_ONLY 공통 상세 (GET /api/v1/archive/party/{partyId}).
// PAPER_ONLY는 participants/chatMessages가 빈 배열, endDate(파티 종료=롤페 기한)로 표시.
export interface PartyDetail {
  id: string;
  /** 표시용 제목 — BE 제목 필드 없음, celebrantNickname + partyOption으로 FE 조합 (리스트와 동일 패턴) */
  title: string;
  date: string;
  time: string;
  /** 파티 종료 시각 (PAPER_ONLY 롤페 기간 종료) */
  endDate: string;
  participantCount: number;
  participants: string[];
  role: PartyRole;
  myPaperWritten: boolean;
  myPaperContent?: string;
  /** 본인 롤페 작성 시 닉네임 스냅샷 (참가자 모달용) */
  myPaperWriterNickname?: string;
  paperCount: number;
  chatMessages: ChatMessage[];
}
