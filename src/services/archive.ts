import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import { PARTY_ROLE, type PartyRole } from '@/constants/party';
import { api } from '@/services/api';
import type { components } from '@/types/api';
import type { ArchiveListItem, PartyDetail } from '@/types/archive';
import { formatArchiveDate, parseKstDateTime } from '@/utils/date';

const ARCHIVE_PAGE_SIZE = 20;

type ArchiveListResponse = components['schemas']['ArchiveListResponse'];
type ArchiveItemResponse = components['schemas']['ArchiveListItemResponse'];
type ArchivePartyDetailResponse = components['schemas']['ArchivePartyDetailResponse'];

// 표시용 제목 조합 — 디자인은 "{주인공}의 파티 / {주인공}의 롤링페이퍼" 형식.
// BE title(party.name)은 비어 오는 경우가 많아(커스텀 이름 미입력) celebrantName + type으로 조합한다.
function buildArchiveTitle(item: ArchiveItemResponse): string {
  const kind = item.type === 'PAPER' ? '롤링페이퍼' : '파티';
  const name = item.celebrantName?.trim();
  if (name) return `${name}의 ${kind}`;
  // 주인공 이름이 없으면 BE title fallback, 그것도 없으면 종류만
  return item.title?.trim() || kind;
}

function mapArchiveItem(item: ArchiveItemResponse): ArchiveListItem {
  // stamp는 BE 미제공 — ArchiveStampCard에서 partyId 해시(getStampForId)로 채운다.
  // BE TODO: ArchiveListItemResponse에 role(HOST/PARTICIPANT) 추가 필요 — 상세 응답과 동일 필드.
  //          추가 전엔 undefined → "내가 만든 파티" 필터 ON 시 빈 목록. (api 타입 재생성 후 캐스팅 제거)
  return {
    id: item.id ?? '',
    partyId: item.partyId != null ? String(item.partyId) : '',
    type: item.type ?? 'PARTY',
    title: buildArchiveTitle(item),
    celebrantName: item.celebrantName ?? null,
    date: item.date ? formatArchiveDate(item.date) : '',
    role: (item as { role?: PartyRole }).role,
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
    partyName: res.partyName ?? '',
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
