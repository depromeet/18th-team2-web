import { queryOptions, useQuery } from '@tanstack/react-query';

import type { ArchiveListItem, PaperDetail, PartyDetail } from '@/types/archive';

// TODO: BE API 미정 — 응답 형태 확정되면 queryFn 교체
// 필요 엔드포인트: GET /api/v1/archive, /archive/party/:id, /archive/paper/:id

const MOCK_LIST: ArchiveListItem[] = [
  { id: 'p-1', type: 'PARTY', title: '김유빈의 파티', date: '26.11.25', stamp: 'strawberry' },
  { id: 'w-1', type: 'PAPER', title: '정선진의 롤링페이퍼', date: '26.11.24', stamp: 'candle' },
  { id: 'p-2', type: 'PARTY', title: '한세라의 파티', date: '26.11.23', stamp: 'firework' },
  { id: 'w-2', type: 'PAPER', title: '이희주의 롤링페이퍼', date: '26.11.22', stamp: 'rollcake' },
  { id: 'p-3', type: 'PARTY', title: '김민수의 파티', date: '26.11.21', stamp: 'donut' },
  { id: 'p-4', type: 'PARTY', title: '현혜주의 파티', date: '26.11.20', stamp: 'firework' },
  { id: 'w-3', type: 'PAPER', title: '신현진의 롤링페이퍼', date: '26.11.19', stamp: 'candle' },
  { id: 'p-5', type: 'PARTY', title: '이윤영의 파티', date: '26.11.18', stamp: 'strawberry' },
  { id: 'p-6', type: 'PARTY', title: '허은정의 파티', date: '26.11.17', stamp: 'donut' },
  { id: 'w-4', type: 'PAPER', title: '최태규의 롤링페이퍼', date: '26.11.16', stamp: 'rollcake' },
  { id: 'p-7', type: 'PARTY', title: '박민호의 파티', date: '26.11.15', stamp: 'firework' },
  { id: 'w-5', type: 'PAPER', title: '서지원의 롤링페이퍼', date: '26.11.14', stamp: 'rollcake' },
];

const MOCK_CHAT = Array.from({ length: 7 }, (_, i) => ({
  id: `m-${i + 1}`,
  authorName: '해파리',
  content:
    '생추카! 생추카!생추카!생추카!생추카!생추카!생추카!생추카!생추카!생추카!생추카!생추카!생추카!',
  sentAt: '12:00',
}));

function createMockPartyDetail(id: string): PartyDetail {
  const listItem = MOCK_LIST.find((item) => item.id === id);
  const isHost = id === 'p-3';
  return {
    id,
    partyName: listItem?.title ?? '김유빈의 파티',
    date: listItem?.date ?? '26.11.25',
    time: '14:00',
    participantCount: 20,
    participants: Array(15).fill('해파리'),
    role: isHost ? 'HOST' : 'PARTICIPANT',
    myPaperWritten: !isHost,
    myPaperContent:
      '생일 축하해!!! 이 글자의 최대 길이는 여기까지 이 글자의 최대 길이는 여기까지 이 글자의 최대 길이는 여기까지 이 글자의 최대 길이는 여기까지 이 글자의 최대 길이는 여기까지 최대 길이는 여기',
    paperCount: isHost ? 17 : 0,
    chatMessages: MOCK_CHAT,
    stamp: listItem?.stamp,
  };
}

function createMockPaperDetail(id: string): PaperDetail {
  const listItem = MOCK_LIST.find((item) => item.id === id);
  const isHost = id === 'w-1';
  return {
    id,
    title: listItem?.title ?? '김유빈의 롤링페이퍼',
    startDate: listItem?.date ?? '26.11.25',
    endDate: '26.12.03',
    role: isHost ? 'HOST' : 'PARTICIPANT',
    paperCount: isHost ? 17 : 0,
    myPaperWritten: !isHost,
    myPaperContent: !isHost
      ? '생일 축하해!!! 이 글자의 최대 길이는 여기까지 이 글자의 최대 길이는 여기까지 이 글자의 최대 길이는 여기까지 이 글자의 최대 길이는 여기까지 이 글자의 최대 길이는 여기까지 최대 길이는 여기'
      : undefined,
    stamp: listItem?.stamp,
  };
}

export const archiveQueries = {
  list: () =>
    queryOptions({
      queryKey: ['archive', 'list'],
      queryFn: () => Promise.resolve(MOCK_LIST),
    }),
  partyDetail: (partyId: string) =>
    queryOptions({
      queryKey: ['archive', 'party', partyId],
      queryFn: () => Promise.resolve(createMockPartyDetail(partyId)),
    }),
  paperDetail: (wrapperId: string) =>
    queryOptions({
      queryKey: ['archive', 'paper', wrapperId],
      queryFn: () => Promise.resolve(createMockPaperDetail(wrapperId)),
    }),
};

export function useArchiveList() {
  return useQuery(archiveQueries.list());
}

export function useArchivePartyDetail(partyId: string) {
  return useQuery(archiveQueries.partyDetail(partyId));
}

export function useArchivePaperDetail(wrapperId: string) {
  return useQuery(archiveQueries.paperDetail(wrapperId));
}
