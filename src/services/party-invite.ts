import { queryOptions, useQuery } from '@tanstack/react-query';

import type { components } from '@/types/api';

// ── Types (from OpenAPI) ──

export type PartyInviteLookup = components['schemas']['PartyInviteLookupResponse'];

// ── Mock Data ──
// TODO: BE에 실제 파티 데이터가 생성되면 queryFn을 `api.get('/api/v1/party-invites/{inviteToken}')`로 교체

function createMockData(inviteToken: string): PartyInviteLookup {
  // 테스트 편의를 위한 임시 분기
  // - 'expired' → 파티 종료 + 작성 마감
  // - 'ended' → 파티 종료 + 작성 가능
  // - 그 외 → 파티 진행 중
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (inviteToken === 'expired') {
    const start = new Date(todayMidnight.getTime() - 10 * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      celebrantNickname: '김이라',
      partyOption: 'REALTIME',
      partyEnded: true,
      rollingPaperWritten: false,
      partyStartDate: toIsoDate(start),
      partyEndDate: toIsoDate(end),
    };
  }

  if (inviteToken === 'ended') {
    const start = new Date(todayMidnight.getTime() - 1 * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      celebrantNickname: '김이라',
      partyOption: 'REALTIME',
      partyEnded: true,
      rollingPaperWritten: false,
      partyStartDate: toIsoDate(start),
      partyEndDate: toIsoDate(end),
    };
  }

  // 진행 중 (기본)
  const start = new Date(todayMidnight.getTime() + 1 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  return {
    celebrantNickname: '김이라',
    partyOption: 'REALTIME',
    partyEnded: false,
    rollingPaperWritten: false,
    partyStartDate: toIsoDate(start),
    partyEndDate: toIsoDate(end),
  };
}

function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
