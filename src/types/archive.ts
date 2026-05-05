export type ArchiveItemType = 'PARTY' | 'PAPER';
export type StampType = 'strawberry' | 'candle' | 'firework' | 'rollcake' | 'donut';
export type PartyRole = 'HOST' | 'PARTICIPANT';

export interface ArchiveListItem {
  id: string;
  type: ArchiveItemType;
  title: string;
  date: string;
  stamp?: StampType;
}

export interface ChatMessage {
  id: string;
  authorName: string;
  content: string;
  sentAt: string;
}

export interface PaperDetail {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  role: PartyRole;
  paperCount: number;
  myPaperWritten: boolean;
  myPaperContent?: string;
  stamp?: StampType;
}

export interface PartyDetail {
  id: string;
  partyName: string;
  date: string;
  time: string;
  participantCount: number;
  participants: string[];
  role: PartyRole;
  myPaperWritten: boolean;
  myPaperContent?: string;
  paperCount: number;
  chatMessages: ChatMessage[];
  stamp?: StampType;
}
