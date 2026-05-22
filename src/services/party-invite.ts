import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { components } from '@/types/api';

// ── Types (from OpenAPI) ──

export type PartyInviteLookup = Omit<
  components['schemas']['PartyInviteLookupResponse'],
  'host' | 'partyId'
> & {
  partyId: string;
  isHost: boolean;
};

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
          isHost: raw.host ?? false,
        } satisfies PartyInviteLookup;
      },
    }),
};

// ── Query hooks ──

export function usePartyInvite(inviteToken: string) {
  return useQuery(partyInviteQueries.detail(inviteToken));
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
