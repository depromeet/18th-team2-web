import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { ROLLING_PAPER_DURATION_DAYS } from '@/constants/partyCreate';
import { api } from '@/services/api';
import type { components } from '@/types/api';
import { parseKstDateTime } from '@/utils/date';

// ── Types (from OpenAPI) ──

export type PartyInviteLookup = Omit<
  components['schemas']['PartyInviteLookupResponse'],
  'partyId'
> & {
  partyId: string;
};

// ── 도메인 계산 ──

/**
 * 롤링페이퍼 작성 마감 시각.
 * - REALTIME: 실시간 파티 시작 + 7일 (liveStartAt 기반, 시·분까지 정밀)
 * - PAPER_ONLY: partyEndDate (= 생성일 + 7일, 날짜 단위)
 *
 * partyEndDate는 "파티 종료일"이 아니라 작성 마감일(시작/생성 + 7일)이지만 date라 시·분이 없다.
 * REALTIME은 liveStartAt이 있으므로 규칙대로 직접 계산해 정밀도를 살린다.
 */
export function getRollingPaperWritableUntil(data: PartyInviteLookup): Date {
  if (data.partyOption === 'REALTIME' && data.realtimeSchedule?.liveStartAt) {
    return parseKstDateTime(data.realtimeSchedule.liveStartAt)
      .add(ROLLING_PAPER_DURATION_DAYS, 'day')
      .toDate();
  }
  if (!data.partyEndDate) throw new Error('partyEndDate가 없어 작성 마감을 계산할 수 없습니다');
  return new Date(data.partyEndDate);
}

// ── queryOptions 팩토리 ──

export const partyInviteQueries = {
  detail: (inviteToken: string) =>
    queryOptions({
      queryKey: ['party-invite', inviteToken],
      queryFn: async () => {
        const res = await api.get<components['schemas']['ApiResponsePartyInviteLookupResponse']>(
          `/api/v1/party-invites/${inviteToken}`,
        );
        const raw = res.data;
        if (!raw) throw new Error('no data');
        return {
          ...raw,
          partyId: String(raw.partyId),
        } satisfies PartyInviteLookup;
      },
      enabled: Boolean(inviteToken),
    }),
};

// ── Query hooks ──

export function usePartyInvite(inviteToken: string, options?: { enabled?: boolean }) {
  return useQuery({
    ...partyInviteQueries.detail(inviteToken),
    enabled: Boolean(inviteToken) && (options?.enabled ?? true),
  });
}

// ── Mutation hooks ──

export function useJoinPartyInvite() {
  return useMutation({
    mutationFn: (inviteToken: string) =>
      api.post<components['schemas']['ApiResponsePartyInviteParticipationResponse']>(
        `/api/v1/party-invites/${inviteToken}/participants/me`,
      ),
  });
}
