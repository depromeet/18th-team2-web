import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { components } from '@/types/api';

// TODO: API 연결 시 mock 데이터 제거
export interface Participant {
  id: number;
  nickname: string;
  imageUrl: string;
}

export type ParticipantRealtimeProfile = components['schemas']['ParticipantRealtimeProfileResult'];
export type UpsertRealtimeProfileRequest =
  components['schemas']['UpsertParticipantRealtimeProfileRequest'];

export const realtimeProfileQueries = {
  me: (inviteToken: string, enabled = true) =>
    queryOptions({
      queryKey: ['realtime-profile', inviteToken],
      queryFn: async () => {
        const res = await api.get<
          components['schemas']['ApiResponseParticipantRealtimeProfileResult']
        >(`/api/v1/party-invites/${inviteToken}/participants/me/realtime-profile`);
        return res.data ?? null;
      },
      enabled: enabled && Boolean(inviteToken),
    }),
};

export function useGetMyRealtimeProfile(inviteToken: string, enabled = true) {
  return useQuery(realtimeProfileQueries.me(inviteToken, enabled));
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
