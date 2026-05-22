import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import { api } from '@/services/api';
import type { components } from '@/types/api';
import type { ArchiveListItem, PaperDetail, PartyDetail } from '@/types/archive';
import { formatArchiveDate } from '@/utils/date';

// TODO: 상세(파티/롤페) BE 엔드포인트 미정 — 확정되면 partyDetail/paperDetail queryFn 교체
// 필요 엔드포인트: GET /api/v1/archive/party/:id, /archive/paper/:id
// TODO: 상세 응답에서 role/stamp/myPaperWritten 등 필드 동기화

const ARCHIVE_PAGE_SIZE = 20;

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

const MOCK_PARTICIPANT_NAMES = [
  '해파리',
  '바닷별',
  '오징어',
  '문어',
  '돌고래',
  '거북이',
  '소라',
  '고래',
  '복어',
  '꽃게',
  '새우',
  '멍게',
  '미역',
  '전복',
  '청새치',
];

const MOCK_CHAT = Array.from({ length: 7 }, (_, i) => ({
  id: `m-${i + 1}`,
  authorName: MOCK_PARTICIPANT_NAMES[i % MOCK_PARTICIPANT_NAMES.length],
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
    participantCount: MOCK_PARTICIPANT_NAMES.length,
    participants: MOCK_PARTICIPANT_NAMES,
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

type ArchiveListResponse = components['schemas']['ArchiveListResponse'];
type ArchiveItemResponse = components['schemas']['ArchiveListItemResponse'];

function mapArchiveItem(item: ArchiveItemResponse): ArchiveListItem {
  // stamp는 BE 미제공 — ArchiveStampCard에서 id 해시(getStampForId)로 채운다.
  return {
    id: item.id ?? '',
    type: item.type ?? 'PARTY',
    title: item.title ?? '',
    celebrantName: item.celebrantName ?? null,
    date: item.date ? formatArchiveDate(item.date) : '',
  };
}

async function fetchArchivePage(cursor: string | null): Promise<ArchiveListResponse> {
  const query = new URLSearchParams({ size: String(ARCHIVE_PAGE_SIZE) });
  if (cursor) query.set('cursor', cursor);

  const res = await api.get<components['schemas']['ApiResponseArchiveListResponse']>(
    `/api/v1/archive?${query.toString()}`,
  );
  return res.data ?? { items: [], nextCursor: null, totalCount: 0 };
}

export const archiveQueries = {
  list: () =>
    infiniteQueryOptions({
      queryKey: ['archive', 'list'],
      queryFn: ({ pageParam }) => fetchArchivePage(pageParam),
      initialPageParam: null as string | null,
      // nextCursor가 null·빈 문자열이면 다음 페이지 없음으로 처리
      getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    }),
  partyDetail: (partyId: string) =>
    queryOptions({
      queryKey: ['archive', 'party', partyId],
      queryFn: () => Promise.resolve(createMockPartyDetail(partyId)),
      enabled: !!partyId,
    }),
  paperDetail: (paperId: string) =>
    queryOptions({
      queryKey: ['archive', 'paper', paperId],
      queryFn: () => Promise.resolve(createMockPaperDetail(paperId)),
      enabled: !!paperId,
    }),
};

export function useArchiveList() {
  return useInfiniteQuery({
    ...archiveQueries.list(),
    select: (data) => ({
      items: data.pages.flatMap((page) => (page.items ?? []).map(mapArchiveItem)),
      totalCount: data.pages[0]?.totalCount ?? 0,
    }),
  });
}

export function useArchivePartyDetail(partyId: string) {
  return useQuery(archiveQueries.partyDetail(partyId));
}

export function useArchivePaperDetail(paperId: string) {
  return useQuery(archiveQueries.paperDetail(paperId));
}
