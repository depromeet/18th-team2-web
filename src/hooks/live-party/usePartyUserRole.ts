import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { PARTY_USER } from '@/constants/live-party';
import { useGetPartyParticipants } from '@/services/live-party';

export function usePartyUserRole() {
  const { partyId } = useParams<{ partyId: string }>();
  const { data: participantsData } = useGetPartyParticipants(partyId);

  return useMemo(() => {
    const me = participantsData?.participants?.find((p) => p.isMe);
    if (me?.isCelebrant) return PARTY_USER.HOST;
    return PARTY_USER.PARTICIPANT_NOT_WRITTEN;
  }, [participantsData]);
}
