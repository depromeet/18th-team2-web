import { queryOptions, useQuery } from '@tanstack/react-query';

import type { components } from '@/types/api';
import { formatIsoDate } from '@/utils/date';

// ── Types (from OpenAPI) ──

export type PartyInviteLookup = components['schemas']['PartyInviteLookupResponse'];

// ── Mock Data ──
// TODO: BE에 실제 파티 데이터가 생성되면 queryFn을 `api.get('/api/v1/party-invites/{inviteToken}')`로 교체
// 토큰 prefix로 분기 — 'host-*' (주최자), 'expired' (마감), 'ended' (작성 가능), 그 외 (진행 중)

interface MockOverride {
  partyEnded: boolean;
  startsDaysFromNow: number;
}

const MOCK_OVERRIDES: Record<string, MockOverride> = {
  expired: { partyEnded: true, startsDaysFromNow: -10 },
  ended: { partyEnded: true, startsDaysFromNow: -1 },
};

function createMockData(inviteToken: string): PartyInviteLookup {
  const override = MOCK_OVERRIDES[inviteToken] ?? { partyEnded: false, startsDaysFromNow: 1 };
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(
    todayMidnight.getTime() + override.startsDaysFromNow * 24 * 60 * 60 * 1000,
  );
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    celebrantNickname: '김이라',
    partyOption: 'REALTIME',
    partyEnded: override.partyEnded,
    rollingPaperWritten: false,
    partyStartDate: formatIsoDate(start),
    partyEndDate: formatIsoDate(end),
  };
}

// ── queryOptions 팩토리 ──

export const partyInviteQueries = {
  detail: (inviteToken: string) =>
    queryOptions({
      queryKey: ['party-invite', inviteToken],
      queryFn: () => Promise.resolve(createMockData(inviteToken)),
    }),
};

// ── Query hooks ──

export function usePartyInvite(inviteToken: string) {
  return useQuery(partyInviteQueries.detail(inviteToken));
}
