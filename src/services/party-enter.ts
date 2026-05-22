import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { components } from '@/types/api';

// TODO: API 연결 시 mock 데이터 제거
export interface Participant {
  id: number;
  nickname: string;
  imageUrl: string;
}

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 1,
    nickname: '하파린',
    imageUrl: 'https://placehold.co/40x40',
  },
  {
    id: 2,
    nickname: '소다',
    imageUrl: 'https://placehold.co/40x40',
  },
  {
    id: 3,
    nickname: '민트',
    imageUrl: 'https://placehold.co/40x40',
  },
];

export type ParticipantRealtimeProfile = components['schemas']['ParticipantRealtimeProfileResult'];
export type UpsertRealtimeProfileRequest =
  components['schemas']['UpsertParticipantRealtimeProfileRequest'];

export const realtimeProfileQueries = {
  me: (inviteToken: string) =>
    queryOptions({
      queryKey: ['realtime-profile', inviteToken],
      queryFn: async () => {
        const res = await api.get<
          components['schemas']['ApiResponseParticipantRealtimeProfileResult']
        >(`/api/v1/party-invites/${inviteToken}/participants/me/realtime-profile`);
        return res.data ?? null;
      },
      enabled: Boolean(inviteToken),
    }),
};

export function useGetMyRealtimeProfile(inviteToken: string) {
  return useQuery(realtimeProfileQueries.me(inviteToken));
}

export function useUpsertMyRealtimeProfile() {
  return useMutation({
    mutationFn: ({
      inviteToken,
      body,
    }: {
      inviteToken: string;
      body: UpsertRealtimeProfileRequest;
    }) =>
      api.put<components['schemas']['ApiResponseParticipantRealtimeProfileResult']>(
        `/api/v1/party-invites/${inviteToken}/participants/me/realtime-profile`,
        body,
      ),
  });
}
