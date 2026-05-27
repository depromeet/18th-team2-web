import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { components } from '@/types/api';

// ── Types ──

export type ToppingType = 'cherry' | 'strawberry' | 'candle';

export interface RollingPaperMessage {
  id: string;
  content: string;
  writerName: string;
  toppingType: ToppingType;
}

export interface RollingPaperData {
  partyId: string;
  hostName: string;
  messages: RollingPaperMessage[];
  partyStartedAt: string | null;
  writableUntil: string | null;
  totalCount: number;
}

export interface WriteRollingPaperParams {
  inviteToken: string;
  writerNickname: string;
  content: string;
  toppingType: ToppingType;
}

const TOPPING_ID: Record<ToppingType, number> = { candle: 1, cherry: 2, strawberry: 3 };

function toppingTypeFromUrl(url: string | null | undefined): ToppingType {
  if (!url) return 'cherry';
  const u = url.toLowerCase();
  if (u.includes('candle')) return 'candle';
  if (u.includes('strawberry')) return 'strawberry';
  return 'cherry';
}

function mapItems(
  items: components['schemas']['RollingPaperListItemResponse'][] | undefined,
): RollingPaperMessage[] {
  return (items ?? []).map((item) => ({
    id: String(item.rollingPaperId),
    content: item.content ?? '',
    writerName: item.writerNickname ?? '',
    toppingType: toppingTypeFromUrl(item.wrapperImageUrl),
  }));
}

// ── queryOptions 팩토리 ──

export const rollingPaperQueries = {
  // 참가자: inviteToken 기반, 주최자: partyId 기반
  list: (partyId: string, inviteToken?: string, page = 1, enabled = true) =>
    queryOptions({
      queryKey: ['rolling-paper', inviteToken ? `invite-${inviteToken}` : `party-${partyId}`, page],
      queryFn: async (): Promise<RollingPaperData> => {
        if (inviteToken) {
          const res = await api.get<
            components['schemas']['ApiResponseParticipantRollingPaperListResponse']
          >(`/api/v1/party-invites/${inviteToken}/rolling-papers?page=${page}`);
          const raw = res.data;
          if (!raw) throw new Error('no data');
          return {
            partyId,
            hostName: '',
            messages: mapItems(raw.items),
            partyStartedAt: null,
            writableUntil: null,
            totalCount: raw.totalCount ?? 0,
          };
        }

        const res = await api.get<
          components['schemas']['ApiResponseOwnerRollingPaperListResponse']
        >(`/api/v1/parties/${partyId}/rolling-papers?page=${page}`);
        const raw = res.data;
        if (!raw) throw new Error('no data');
        return {
          partyId,
          hostName: raw.celebrantNickname ?? '',
          messages: mapItems(raw.items),
          partyStartedAt: null,
          // partyEndAt = startedAt + 7일 = 작성 마감 (BE Party.endedAt 기준).
          // OpenAPI 설명("파티 자체 종료 시각")은 오해 소지 — 실제 파티 종료는 liveEndAt. +7일 금지.
          writableUntil: raw.partyEndAt ?? null,
          totalCount: raw.totalCount ?? 0,
        };
      },
      enabled: enabled && Boolean(partyId),
    }),
};

// ── Query hooks ──

export function useRollingPaper(partyId: string, inviteToken?: string, page = 1, enabled = true) {
  return useQuery(rollingPaperQueries.list(partyId, inviteToken, page, enabled));
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
