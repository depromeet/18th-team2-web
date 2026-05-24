import characterBlueHostSrc from '@/assets/images/character/character-blue-host.png';
import characterBrownFullSrc from '@/assets/images/character/character-brown-full.png';
import characterPinkFullSrc from '@/assets/images/character/character-pink-full.png';
import characterWhiteFullSrc from '@/assets/images/character/character-white-full.png';
import characterYellowFullSrc from '@/assets/images/character/character-yellow-full.png';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { components } from '@/types/api';

// TODO: API 연결 시 mock 데이터 제거
export type ParticipantRole = 'host' | 'participant';

export interface PartyParticipant {
  id: number;
  name: string;
  image: string;
  role: ParticipantRole;
  isCurrentUser?: boolean;
}

export const MOCK_PARTY_PARTICIPANTS: PartyParticipant[] = [
  { id: 1, name: '하파린', image: characterBlueHostSrc, role: 'host' },
  { id: 2, name: '소다', image: characterPinkFullSrc, role: 'participant', isCurrentUser: true },
  { id: 3, name: '민트', image: characterYellowFullSrc, role: 'participant' },
  { id: 4, name: '버블', image: characterBrownFullSrc, role: 'participant' },
  { id: 5, name: '구름', image: characterWhiteFullSrc, role: 'participant' },
];

export type RealtimePartyState = components['schemas']['RealtimePartyStateResult'];
export type RealtimePartyEndResult = components['schemas']['RealtimePartyEndResult'];
export type PartyParticipantsResult = components['schemas']['PartyParticipantsResponse'];
export type PartyParticipantResult = components['schemas']['PartyParticipantResponse'];

export const realtimePartyQueries = {
  state: (partyId: string) =>
    queryOptions({
      queryKey: ['realtime-party-state', partyId],
      queryFn: async () => {
        const res = await api.get<components['schemas']['ApiResponseRealtimePartyStateResult']>(
          `/api/v1/parties/${partyId}/realtime-state`,
        );
        return res.data ?? null;
      },
      enabled: Boolean(partyId),
      refetchInterval: 3000,
    }),
  participants: (partyId: string, enabled = true) =>
    queryOptions({
      queryKey: ['party-participants', partyId],
      queryFn: async () => {
        const res = await api.get<components['schemas']['ApiResponsePartyParticipantsResponse']>(
          `/api/v1/parties/${partyId}/participants`,
        );
        return res.data ?? null;
      },
      enabled: Boolean(partyId) && enabled,
      refetchInterval: 3000,
    }),
};

export function useRealtimePartyState(partyId: string) {
  return useQuery(realtimePartyQueries.state(partyId));
}

export function usePartyParticipants(partyId: string, enabled = true) {
  return useQuery(realtimePartyQueries.participants(partyId, enabled));
}

export function useStartRealtimeEnd() {
  return useMutation({
    mutationFn: async (partyId: string) => {
      const res = await api.post<components['schemas']['ApiResponseRealtimePartyEndResult']>(
        `/api/v1/parties/${partyId}/realtime-end`,
      );
      return res.data ?? null;
    },
  });
}
