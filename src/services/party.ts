import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { UpcomingParty } from '@/types/home';

const UPCOMING_PARTIES_QUERY_KEY = ['me', 'upcoming-parties'] as const;
const PARTY_INVITE_QUERY_KEY = ['party-invite'] as const;

export function useDeleteParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partyId: string) => api.delete(`/api/v1/parties/${partyId}`),
    onSuccess: (_data, partyId) => {
      queryClient.setQueryData<UpcomingParty[]>(UPCOMING_PARTIES_QUERY_KEY, (parties) =>
        parties?.filter((party) => party.partyId !== partyId),
      );
      queryClient.removeQueries({ queryKey: PARTY_INVITE_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: UPCOMING_PARTIES_QUERY_KEY });
    },
  });
}
