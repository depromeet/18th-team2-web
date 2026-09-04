import { useMutation } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { components } from '@/types/api';

type ApiResponseRegisterPartyTalkCalendarEventResult =
  components['schemas']['ApiResponseRegisterPartyTalkCalendarEventResult'];
type ApiResponseKakaoCalendarConsentUrlResult =
  components['schemas']['ApiResponseKakaoCalendarConsentUrlResult'];

export function useRegisterPartyTalkCalendar() {
  return useMutation({
    mutationFn: (partyId: string) =>
      api.post<ApiResponseRegisterPartyTalkCalendarEventResult>(
        `/api/v1/parties/${partyId}/talk-calendar`,
      ),
  });
}

export function useIssueTalkCalendarConsentUrl() {
  return useMutation({
    mutationFn: (returnPath: string) =>
      api.get<ApiResponseKakaoCalendarConsentUrlResult>(
        `/api/v1/me/talk-calendar-connection/consent-url?returnPath=${encodeURIComponent(
          returnPath,
        )}`,
      ),
  });
}
