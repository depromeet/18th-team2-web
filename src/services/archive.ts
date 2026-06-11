import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import { PARTY_ROLE } from '@/constants/party';
import { api } from '@/services/api';
import type { components } from '@/types/api';
import type { ArchiveItemType, ArchiveListItem, PartyDetail } from '@/types/archive';
import { formatArchiveDate, parseKstDateTime } from '@/utils/date';

const ARCHIVE_PAGE_SIZE = 20;

type ArchiveListResponse = components['schemas']['ArchiveListResponse'];
type ArchiveItemResponse = components['schemas']['ArchiveListItemResponse'];
type ArchivePartyDetailResponse = components['schemas']['ArchivePartyDetailResponse'];

// 표시용 제목 조합 — 디자인은 "{주인공}의 파티 / {주인공}의 롤링페이퍼" 형식.
// BE는 제목 필드를 주지 않아(응답 title 제거됨) 주인공 닉네임 + 종류로 조합한다.
function buildArchiveTitle(
  celebrantName: string | null | undefined,
  type: ArchiveItemType,
): string {
  const kind = type === 'PAPER' ? '롤링페이퍼' : '파티';
  const name = celebrantName?.trim();
  return name ? `${name}의 ${kind}` : kind;
}

function mapArchiveItem(item: ArchiveItemResponse): ArchiveListItem {
  // stamp는 BE 미제공 — ArchiveStampCard에서 partyId 해시(getStampForId)로 채운다.
  const type = item.type ?? 'PARTY';
  return {
    id: item.id ?? '',
    partyId: item.partyId != null ? String(item.partyId) : '',
    type,
    title: buildArchiveTitle(item.celebrantName, type),
    date: item.date ? formatArchiveDate(item.date) : '',
    role: item.role ?? PARTY_ROLE.PARTICIPANT,
  };
}

// ISO date-time → KST 포맷. 없거나 잘못된 값이면 빈 문자열('Invalid Date' 노출 방지).
function formatKstOrEmpty(iso: string | null | undefined, pattern: string): string {
  if (!iso) return '';
  const d = parseKstDateTime(iso);
  return d.isValid() ? d.format(pattern) : '';
}

// PARTY/PAPER_ONLY 모두 GET /api/v1/archive/party/{partyId} 한 엔드포인트로 조회한다.
// PAPER_ONLY는 participants/chatMessages가 빈 배열로 응답. stamp는 BE 미제공(StampHeroCard 해시).
function mapArchiveDetail(res: ArchivePartyDetailResponse): PartyDetail {
  return {
    id: res.partyId != null ? String(res.partyId) : '',
    // 상세엔 BE 제목 필드가 없음 — celebrantNickname + partyOption으로 리스트와 동일 패턴 조합
    title: buildArchiveTitle(
      res.celebrantNickname,
      res.partyOption === 'PAPER_ONLY' ? 'PAPER' : 'PARTY',
    ),
    date: formatKstOrEmpty(res.partyStartedAt, 'YY.MM.DD'),
    time: formatKstOrEmpty(res.partyStartedAt, 'HH:mm'),
    endDate: formatKstOrEmpty(res.partyEndedAt, 'YY.MM.DD'),
    participantCount: res.participantCount ?? 0,
    participants: (res.participants ?? []).map((p) => p.nickname ?? ''),
    role: res.role ?? PARTY_ROLE.PARTICIPANT,
    myPaperWritten: res.myPaperWritten ?? false,
    myPaperContent: res.myPaperContent ?? undefined,
    myPaperWriterNickname: res.myPaperWriterNickname ?? undefined,
    paperCount: res.paperCount ?? 0,
    chatMessages: (res.chatMessages ?? []).map((msg) => ({
      id: msg.id != null ? String(msg.id) : '',
      authorName: msg.authorName ?? '',
      content: msg.content ?? '',
      sentAt: formatKstOrEmpty(msg.sentAt, 'HH:mm'),
    })),
  };
}

async function fetchArchivePage(cursor: string | null): Promise<ArchiveListResponse> {
  const query = new URLSearchParams({ size: String(ARCHIVE_PAGE_SIZE) });
  if (cursor) query.set('cursor', cursor);

  const res = await api.get<components['schemas']['ApiResponseArchiveListResponse']>(
    `/api/v1/archive?${query.toString()}`,
  );
  return res.data ?? { items: [], totalCount: 0 };
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
  // PARTY/PAPER 공통 상세 — partyId 기반
  detail: (partyId: string) =>
    queryOptions({
      queryKey: ['archive', 'detail', partyId],
      queryFn: async () => {
        const res = await api.get<components['schemas']['ApiResponseArchivePartyDetailResponse']>(
          `/api/v1/archive/party/${partyId}`,
        );
        if (!res.data) throw new Error('보관함 상세를 불러올 수 없습니다');
        return mapArchiveDetail(res.data);
      },
      enabled: !!partyId,
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

export function useArchiveDetail(partyId: string) {
  return useQuery(archiveQueries.detail(partyId));
}
