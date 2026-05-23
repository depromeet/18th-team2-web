import { queryOptions, useQuery } from '@tanstack/react-query';

import { PARTY_ROLE } from '@/constants/party';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { components } from '@/types/api';
import type { UpcomingParty } from '@/types/home';
import { formatKoreanTime, parseKstDateTime } from '@/utils/date';

type UpcomingPartyResponse = components['schemas']['UpcomingPartyResponse'];

// 시간 게이트: BE는 "열림 여부"를 직접 주지 않으므로 시각 필드로 파생한다.
// PAPER_ONLY는 hostRollingPaperOpenAt, REALTIME은 realtimeSchedule.enterableFrom 기준.
// (이슈 #84 — 파생 규칙 BE 확인 권장)
function deriveIsOpen(party: UpcomingPartyResponse): boolean {
  const now = Date.now();

  if (party.partyOption === 'PAPER_ONLY') {
    const openAt = party.hostRollingPaperOpenAt;
    return openAt != null && parseKstDateTime(openAt).valueOf() <= now;
  }

  const enterableFrom = party.realtimeSchedule?.enterableFrom;
  return enterableFrom != null && parseKstDateTime(enterableFrom).valueOf() <= now;
}

function buildPartyName(party: UpcomingPartyResponse): string {
  const kind = party.partyOption === 'PAPER_ONLY' ? '롤링페이퍼' : '생일파티';
  if (party.host) return `내 ${kind}`;
  return party.celebrantNickname ? `${party.celebrantNickname}님의 ${kind}` : kind;
}

function mapUpcomingParty(party: UpcomingPartyResponse): UpcomingParty {
  // 잘못된 날짜 문자열이 "Invalid Date"로 노출되지 않도록 isValid 가드
  const startedAt = party.partyStartedAt ? parseKstDateTime(party.partyStartedAt) : null;
  const endedAt = party.partyEndedAt ? parseKstDateTime(party.partyEndedAt) : null;

  return {
    partyId: party.partyId != null ? String(party.partyId) : undefined,
    inviteToken: party.inviteToken ?? undefined,
    partyName: buildPartyName(party),
    date: startedAt?.isValid() ? startedAt.format('YY.MM.DD') : '',
    time: startedAt?.isValid() ? formatKoreanTime(startedAt.toDate()) : undefined,
    endDate: endedAt?.isValid() ? endedAt.format('YY.MM.DD') : undefined,
    role: party.host ? PARTY_ROLE.HOST : PARTY_ROLE.PARTICIPANT,
    partyOption: party.partyOption ?? 'REALTIME',
    isOpen: deriveIsOpen(party),
  };
}

export const meQueries = {
  upcomingParties: () =>
    queryOptions({
      queryKey: ['me', 'upcoming-parties'],
      queryFn: async () => {
        const res = await api.get<components['schemas']['ApiResponseListUpcomingPartyResponse']>(
          '/api/v1/me/upcoming-parties',
        );
        return (res.data ?? []).map(mapUpcomingParty);
      },
    }),
  account: () =>
    queryOptions({
      queryKey: ['me', 'account'],
      queryFn: async () => {
        const res =
          await api.get<components['schemas']['ApiResponseMeAccountResult']>('/api/me/account');
        if (!res.data) throw new Error('계정 정보를 불러올 수 없습니다');
        return res.data;
      },
    }),
};

export function useUpcomingParties() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({ ...meQueries.upcomingParties(), enabled: isAuthenticated });
}

export function useMeAccount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({ ...meQueries.account(), enabled: isAuthenticated });
}
