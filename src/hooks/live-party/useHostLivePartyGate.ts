import { useEffect, useMemo, useState } from 'react';

import {
  usePartyParticipants,
  useRealtimePartyState,
  useStartRealtimeEnd,
} from '@/services/live-party';
import { parseKstDateTime } from '@/utils/date';

const AUTO_END_SECONDS = 60;

function getRemainingEndSeconds(endingStartedAt?: string | null) {
  if (!endingStartedAt) return AUTO_END_SECONDS;

  const startedAt = parseKstDateTime(endingStartedAt);
  if (!startedAt.isValid()) return AUTO_END_SECONDS;

  const elapsedSeconds = Math.floor((Date.now() - startedAt.valueOf()) / 1000);
  return Math.max(0, AUTO_END_SECONDS - elapsedSeconds);
}

function hasLiveStarted(liveStartAt?: string | null) {
  if (!liveStartAt) return false;
  const startAt = parseKstDateTime(liveStartAt);
  return startAt.isValid() && startAt.valueOf() <= Date.now();
}

function hasLiveEnded(status?: string | null, endedAt?: string | null) {
  if (status === 'LIVE_CLOSED') return true;
  if (!endedAt) return false;

  const endAt = parseKstDateTime(endedAt);
  return endAt.isValid() && endAt.valueOf() <= Date.now();
}

export function useHostLivePartyGate(partyId: string, isHost: boolean) {
  const { data: state } = useRealtimePartyState(partyId);
  const { data: participantsData, isLoading: isParticipantsLoading } = usePartyParticipants(
    partyId,
    isHost,
  );
  const { mutate: startRealtimeEnd, data: startedEnd } = useStartRealtimeEnd();

  const participants = useMemo(() => participantsData?.participants ?? [], [participantsData]);
  const celebrant = participants.find((participant) => participant.isCelebrant);
  const guestCount = participants.filter((participant) => !participant.isCelebrant).length;
  const hasGuest = guestCount > 0;
  const started = hasLiveStarted(state?.liveStartAt);
  const endingStartedAt = state?.endingStartedAt ?? startedEnd?.endingStartedAt ?? null;
  const hasEnded = hasLiveEnded(state?.status, state?.endedAt);

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingEndSeconds(endingStartedAt),
  );

  useEffect(() => {
    setRemainingSeconds(getRemainingEndSeconds(endingStartedAt));
    if (!endingStartedAt) return;

    const id = window.setInterval(() => {
      setRemainingSeconds(getRemainingEndSeconds(endingStartedAt));
    }, 1000);

    return () => window.clearInterval(id);
  }, [endingStartedAt]);

  useEffect(() => {
    if (
      !partyId ||
      !isHost ||
      isParticipantsLoading ||
      hasGuest ||
      hasEnded ||
      !started ||
      endingStartedAt
    ) {
      return;
    }
    startRealtimeEnd(partyId);
  }, [
    hasEnded,
    endingStartedAt,
    hasGuest,
    isHost,
    isParticipantsLoading,
    partyId,
    startRealtimeEnd,
    started,
  ]);

  const shouldGateHost = isHost && !isParticipantsLoading && !hasGuest;
  const isEnding = shouldGateHost && started && !hasEnded;
  const isEnded = shouldGateHost && started && (hasEnded || remainingSeconds <= 0);

  return {
    shouldGateHost,
    isEnding,
    isEnded,
    remainingSeconds,
    celebrant,
    participants,
    guestCount,
  };
}
