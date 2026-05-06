import { queryOptions, useQuery } from '@tanstack/react-query';

import type { components } from '@/types/api';
import { formatIsoDate } from '@/utils/date';

// ── Types (from OpenAPI) ──

// BE 응답 + FE 임시 확장 (partyId, isHost는 BE 추가 요청 중)
export type PartyInviteLookup = components['schemas']['PartyInviteLookupResponse'] & {
  partyId: string;
  isHost: boolean;
};

// ── Mock Data ──
// TODO: BE에 실제 파티 데이터가 생성되면 queryFn을 `api.get('/api/v1/party-invites/{inviteToken}')`로 교체
// 토큰별 mock 시나리오:
// - 'expired'  → 작성 마감
// - 'ended'    → 파티 종료 + 작성 가능
// - 'starting' → 파티 시작 임박 (3분 후) — 입장 가능 버튼 활성화
// - 'host-*'   → 주최자 시점 (PartyInviteEntryPage에서 토큰 prefix로 판단)
// - 그 외      → 파티 시작 전 (내일)

const ONE_MINUTE = 60 * 1000;
const ONE_DAY = 24 * 60 * ONE_MINUTE;

interface MockOverride {
  partyEnded: boolean;
  /** 파티 시작 시각 (현재 기준 분 단위 오프셋) */
  startsInMinutes: number;
}

const MOCK_OVERRIDES: Record<string, MockOverride> = {
  expired: { partyEnded: true, startsInMinutes: -10 * 24 * 60 },
  ended: { partyEnded: true, startsInMinutes: -1 * 24 * 60 },
  starting: { partyEnded: false, startsInMinutes: 3 },
};

function createMockData(inviteToken: string): PartyInviteLookup {
  const override = MOCK_OVERRIDES[inviteToken] ?? { partyEnded: false, startsInMinutes: 24 * 60 };
  const start = new Date(Date.now() + override.startsInMinutes * ONE_MINUTE);
  const end = new Date(start.getTime() + 7 * ONE_DAY);

  return {
    // FE 임시 확장 — BE 명세 확정 시 응답에서 그대로 받기
    partyId: `mock-party-${inviteToken}`,
    isHost: inviteToken.includes('host'),
    celebrantNickname: '김이라',
    partyOption: 'REALTIME',
    partyEnded: override.partyEnded,
    rollingPaperWritten: false,
    partyStartDate: formatIsoDate(start),
    partyEndDate: formatIsoDate(end),
    realtimeSchedule: {
      liveStartAt: start.toISOString(),
      enterableFrom: new Date(start.getTime() - 5 * ONE_MINUTE).toISOString(),
      liveEndAt: new Date(start.getTime() + 10 * ONE_MINUTE).toISOString(),
      liveDurationMinutes: 10,
    },
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
