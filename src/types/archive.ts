export type ArchiveItemType = 'PARTY' | 'PAPER';
export type StampType = 'strawberry' | 'candle' | 'firework' | 'rollcake' | 'donut';
export type PartyRole = 'HOST' | 'PARTICIPANT';

export interface ArchiveListItem {
  /** 항목 ID (participant.id) */
  id: string;
  /** 상세 조회용 파티 ID */
  partyId: string;
  type: ArchiveItemType;
  title: string;
  /** 파티 주인공 닉네임. BE 응답 `celebrantName`. 없으면 null */
  celebrantName?: string | null;
  date: string;
  stamp?: StampType;
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
  partyName: string;
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
  stamp?: StampType;
}
