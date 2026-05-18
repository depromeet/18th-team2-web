import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';

export function useDeleteParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partyId: string) => api.delete(`/api/v1/parties/${partyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['party-invite'] });
    },
  });
}
