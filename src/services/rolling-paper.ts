import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { components } from '@/types/api';

// ── Types ──

export type ToppingType = 'cherry' | 'strawberry' | 'candle';

export interface RollingPaperMessage {
  id: string;
  /** 참가자 응답엔 미포함(BE 정책 — 타인 본문 비공개). 주최자·작성 완료 본인만 보유. */
  content?: string;
  writerNickname: string;
  toppingType: ToppingType;
}

export interface RollingPaperData {
  partyId: string;
  /** 주최자 경로에서만 BE가 celebrantNickname을 줌. 참가자는 invite lookup에서 별도 취득. */
  hostName?: string;
  messages: RollingPaperMessage[];
  /** 작성 마감 — 주최자 경로 한정. 참가자는 invite lookup의 liveStartAt+7일로 별도 계산. */
  writableUntil?: string;
  totalCount: number;
}

export interface WriteRollingPaperParams {
  inviteToken: string;
  writerNickname: string;
  content: string;
  toppingType: ToppingType;
}

// toppingId는 BE topping 목록 기준 고정값
const TOPPING_ID: Record<ToppingType, number> = { candle: 1, cherry: 2, strawberry: 3 };

function toppingTypeFromUrl(url: string | null | undefined): ToppingType {
  if (!url) return 'cherry';
  const u = url.toLowerCase();
  if (u.includes('candle')) return 'candle';
  if (u.includes('strawberry')) return 'strawberry';
  return 'cherry';
}

// list 매핑은 메타데이터(id/작성자/토핑)만 추출 — content는 detail 엔드포인트에서 lazy fetch한다.
// 참가자 응답엔 content가 없고(BE 정책), 주최자 list도 content를 주지만 모달 일관성을 위해 안 씀.
type RollingPaperListItem =
  | components['schemas']['ParticipantRollingPaperListItemResult']
  | components['schemas']['OwnerRollingPaperListItemResult'];

function mapItems(items: RollingPaperListItem[] | undefined): RollingPaperMessage[] {
  return (items ?? []).map((item) => ({
    id: String(item.rollingPaperId),
    writerNickname: item.writerNickname ?? '',
    // BE 스멜: list에 toppingType enum이 없어 toppingImageUrl substring 매칭으로 추정.
    // 자산 이름 바뀌면 조용히 깨짐 — BE에 명시적 type 필드 요청 필요.
    toppingType: toppingTypeFromUrl(item.toppingImageUrl),
  }));
}

// ── 상세 ──

export interface RollingPaperDetail {
  id: string;
  content: string;
  writerNickname: string;
}

// ── queryOptions 팩토리 ──

export const rollingPaperQueries = {
  // 주최자용 단건 상세 — 토핑 클릭 시 모달이 content를 lazy fetch
  detail: (partyId: string, rollingPaperId: string) =>
    queryOptions({
      queryKey: ['rolling-paper', 'detail', partyId, rollingPaperId],
      queryFn: async (): Promise<RollingPaperDetail> => {
        const res = await api.get<
          components['schemas']['ApiResponseOwnerRollingPaperDetailResponse']
        >(`/api/v1/parties/${partyId}/rolling-papers/${rollingPaperId}`);
        const raw = res.data;
        if (!raw) throw new Error('no data');
        return {
          id: String(raw.rollingPaperId),
          content: raw.content ?? '',
          writerNickname: raw.writerNickname ?? '',
        };
      },
      enabled: Boolean(partyId && rollingPaperId),
    }),
  // 참가자: inviteToken 기반, 주최자: partyId 기반.
  // 목록은 페이지네이션되지만 ToppingGrid가 캐러셀로 전체 페이지를 한 번에 노출하므로,
  // totalPages만큼 순회해 모든 토핑을 받아온다. (1페이지만 받으면 2페이지 이상이 영구 누락됨)
  list: (partyId: string, inviteToken?: string, enabled = true) =>
    queryOptions({
      queryKey: ['rolling-paper', inviteToken ? `invite-${inviteToken}` : `party-${partyId}`],
      queryFn: async (): Promise<RollingPaperData> => {
        if (inviteToken) {
          const fetchPage = (page: number) =>
            api.get<components['schemas']['ApiResponseParticipantRollingPaperListResponse']>(
              `/api/v1/party-invites/${inviteToken}/rolling-papers?page=${page}`,
            );
          const first = (await fetchPage(1)).data;
          if (!first) throw new Error('no data');
          // 2페이지부터는 병렬로 받아 직렬 워터폴을 피한다.
          const rest = await Promise.all(
            Array.from({ length: Math.max(first.pageInfo.totalPages - 1, 0) }, (_, i) =>
              fetchPage(i + 2),
            ),
          );
          const items = [...(first.items ?? []), ...rest.flatMap((res) => res.data?.items ?? [])];
          // 참가자 응답엔 celebrantNickname/마감 시각이 없음 — BE가 주는 만큼만 매핑한다.
          return {
            partyId,
            messages: mapItems(items),
            totalCount: first.pageInfo.totalCount,
          };
        }

        const fetchPage = (page: number) =>
          api.get<components['schemas']['ApiResponseOwnerRollingPaperListResponse']>(
            `/api/v1/parties/${partyId}/rolling-papers?page=${page}`,
          );
        const first = (await fetchPage(1)).data;
        if (!first) throw new Error('no data');
        // 2페이지부터는 병렬로 받아 직렬 워터폴을 피한다.
        const rest = await Promise.all(
          Array.from({ length: Math.max(first.pageInfo.totalPages - 1, 0) }, (_, i) =>
            fetchPage(i + 2),
          ),
        );
        const items = [...(first.items ?? []), ...rest.flatMap((res) => res.data?.items ?? [])];
        return {
          partyId,
          hostName: first.celebrantNickname ?? undefined,
          messages: mapItems(items),
          // partyEndAt = startedAt + 7일 = 작성 마감 (BE Party.endedAt 기준).
          // OpenAPI 설명("파티 자체 종료 시각")은 오해 소지 — 실제 파티 종료는 liveEndAt. +7일 금지.
          writableUntil: first.partyEndAt ?? undefined,
          totalCount: first.pageInfo.totalCount,
        };
      },
      enabled: enabled && Boolean(partyId),
    }),
};

// ── Query hooks ──

export function useRollingPaper(partyId: string, inviteToken?: string, enabled = true) {
  return useQuery(rollingPaperQueries.list(partyId, inviteToken, enabled));
}

export function useRollingPaperDetail(partyId: string, rollingPaperId: string) {
  return useQuery(rollingPaperQueries.detail(partyId, rollingPaperId));
}

// ── Mutation hooks ──

export function useWriteRollingPaper() {
  return useMutation({
    mutationFn: ({ inviteToken, writerNickname, content, toppingType }: WriteRollingPaperParams) =>
      api.post<components['schemas']['ApiResponseCreateRollingPaperResponse']>(
        `/api/v1/party-invites/${inviteToken}/rolling-papers`,
        {
          writerNickname,
          content,
          toppingId: TOPPING_ID[toppingType],
        } satisfies components['schemas']['CreateRollingPaperRequest'],
      ),
  });
}
