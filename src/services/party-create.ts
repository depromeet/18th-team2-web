import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { components } from '@/types/api';

type CreateRealtimePartyRequest = components['schemas']['CreateRealtimePartyRequest'];
type CreatePaperOnlyPartyRequest = components['schemas']['CreatePaperOnlyPartyRequest'];
type ApiResponseCreatePartyResponse = components['schemas']['ApiResponseCreatePartyResponse'];
type ApiResponseActivateInviteLinkResponse =
  components['schemas']['ApiResponseActivateInviteLinkResponse'];

export function useCreateRealtimeParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateRealtimePartyRequest) =>
      api.post<ApiResponseCreatePartyResponse>('/api/v1/parties/realtime', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'upcoming-parties'] });
    },
  });
}

export function useCreatePaperOnlyParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreatePaperOnlyPartyRequest) =>
      api.post<ApiResponseCreatePartyResponse>('/api/v1/parties/paper-only', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'upcoming-parties'] });
    },
  });
}

export function useActivateInviteLink() {
  return useMutation({
    mutationFn: (partyId: number) =>
      api.post<ApiResponseActivateInviteLinkResponse>(`/api/v1/parties/${partyId}/invite-link`),
  });
}
