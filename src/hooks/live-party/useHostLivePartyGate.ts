import { useEffect, useMemo, useRef, useState } from 'react';

import {
  useGetPartyParticipants,
  useRealtimePartyState,
  useStartRealtimeEnd,
} from '@/services/live-party';
import { parseKstDateTime } from '@/utils/date';

const AUTO_END_SECONDS = 60;

function getServerClockOffset(serverNow?: string | null) {
  if (!serverNow) return null;

  const serverNowTime = parseKstDateTime(serverNow);
  if (!serverNowTime.isValid()) return null;

  return Date.now() - serverNowTime.valueOf();
}

function getRemainingEndSeconds(endingStartedAt?: string | null, serverClockOffsetMs = 0) {
  if (!endingStartedAt) return AUTO_END_SECONDS;

  const startedAt = parseKstDateTime(endingStartedAt);
  if (!startedAt.isValid()) return AUTO_END_SECONDS;

  const nowOnServer = Date.now() - serverClockOffsetMs;
  const elapsedSeconds = Math.floor((nowOnServer - startedAt.valueOf()) / 1000);
  return Math.max(0, AUTO_END_SECONDS - elapsedSeconds);
}

function hasLiveStarted(liveStartAt?: string | null, serverClockOffsetMs = 0) {
  if (!liveStartAt) return false;
  const startAt = parseKstDateTime(liveStartAt);
  return startAt.isValid() && startAt.valueOf() <= Date.now() - serverClockOffsetMs;
}

function hasLiveEnded(status?: string | null, endedAt?: string | null, serverClockOffsetMs = 0) {
  if (status === 'LIVE_CLOSED') return true;
  if (!endedAt) return false;

  const endAt = parseKstDateTime(endedAt);
  return endAt.isValid() && endAt.valueOf() <= Date.now() - serverClockOffsetMs;
}

export function useHostLivePartyGate(partyId: string, isHost: boolean, canFetch = true) {
  const { data: state } = useRealtimePartyState(partyId, canFetch);
  const { data: participantsData, isPending: isParticipantsPending } = useGetPartyParticipants(
    partyId,
    {
      refetchInterval: 3000,
      enabled: isHost && canFetch,
    },
  );
  const { mutate: startRealtimeEnd, data: startedEnd } = useStartRealtimeEnd();

  const participants = useMemo(() => participantsData?.participants ?? [], [participantsData]);
  const celebrant = participants.find((participant) => participant.isCelebrant);
  const guestCount = participants.filter((participant) => !participant.isCelebrant).length;
  const hasGuest = guestCount > 0;
  const endingStartedAt = state?.endingStartedAt ?? startedEnd?.endingStartedAt ?? null;
  const serverNow = state?.serverNow ?? startedEnd?.serverNow ?? null;

  // 게스트가 한 번이라도 입장했는지 추적 — 입장 전 LIVE_ENDING 전환 방지
  const hadGuestsRef = useRef(false);
  const serverClockOffsetRef = useRef(0);

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingEndSeconds(endingStartedAt),
  );
  const started = hasLiveStarted(state?.liveStartAt, serverClockOffsetRef.current);
  const hasEnded = hasLiveEnded(state?.status, state?.endedAt, serverClockOffsetRef.current);

  useEffect(() => {
    if (hasGuest) hadGuestsRef.current = true;
  }, [hasGuest]);

  useEffect(() => {
    const serverClockOffset = getServerClockOffset(serverNow);

    if (serverClockOffset != null) {
      serverClockOffsetRef.current = serverClockOffset;
    }

    setRemainingSeconds(getRemainingEndSeconds(endingStartedAt, serverClockOffsetRef.current));
    if (!endingStartedAt) return;

    const id = window.setInterval(() => {
      setRemainingSeconds(getRemainingEndSeconds(endingStartedAt, serverClockOffsetRef.current));
    }, 1000);

    return () => window.clearInterval(id);
  }, [endingStartedAt, serverNow]);

  useEffect(() => {
    if (
      !partyId ||
      !isHost ||
      isParticipantsPending ||
      hasGuest ||
      hasEnded ||
      !started ||
      endingStartedAt ||
      !hadGuestsRef.current
    ) {
      return;
    }
    startRealtimeEnd(partyId);
  }, [
    hasEnded,
    endingStartedAt,
    hasGuest,
    isHost,
    isParticipantsPending,
    partyId,
    startRealtimeEnd,
    started,
  ]);

  const shouldGateHost = isHost && !isParticipantsPending && !hasGuest;
  const isEnding = shouldGateHost && started && !hasEnded && Boolean(endingStartedAt);
  const isEnded = shouldGateHost && hasEnded;

  return {
    shouldGateHost,
    isEnding,
    isEnded,
    remainingSeconds,
    celebrant,
    participants,
    guestCount,
    state,
  };
}
