import { useEffect, useMemo, useRef, useState } from 'react';

import { useGetPartyParticipants, useStartRealtimeEnd } from '@/services/live-party';
import { useLivePartyStateStore } from '@/stores/useLivePartyStateStore';
import { parseKstDateTime } from '@/utils/date';

const AUTO_END_SECONDS = 60;
const TICK_INTERVAL_MS = 1000;

function getServerClockOffset(serverNow?: string | null) {
  if (!serverNow) return null;

  const serverNowTime = parseKstDateTime(serverNow);
  if (!serverNowTime.isValid()) return null;

  return Date.now() - serverNowTime.valueOf();
}

function getRemainingEndSeconds(
  nowMs: number,
  endingStartedAt?: string | null,
  serverClockOffsetMs = 0,
) {
  if (!endingStartedAt) return AUTO_END_SECONDS;

  const startedAt = parseKstDateTime(endingStartedAt);
  if (!startedAt.isValid()) return AUTO_END_SECONDS;

  const nowOnServer = nowMs - serverClockOffsetMs;
  const elapsedSeconds = Math.floor((nowOnServer - startedAt.valueOf()) / 1000);
  return Math.max(0, AUTO_END_SECONDS - elapsedSeconds);
}

function hasLiveStarted(nowMs: number, liveStartAt?: string | null, serverClockOffsetMs = 0) {
  if (!liveStartAt) return false;
  const startAt = parseKstDateTime(liveStartAt);
  return startAt.isValid() && startAt.valueOf() <= nowMs - serverClockOffsetMs;
}

function hasLiveEnded(
  nowMs: number,
  status?: string | null,
  endedAt?: string | null,
  serverClockOffsetMs = 0,
) {
  if (status === 'LIVE_CLOSED') return true;
  if (!endedAt) return false;

  const endAt = parseKstDateTime(endedAt);
  return endAt.isValid() && endAt.valueOf() <= nowMs - serverClockOffsetMs;
}

export function useHostLivePartyGate(partyId: string, isHost: boolean) {
  const liveStartAt = useLivePartyStateStore((s) => s.liveStartAt);
  const status = useLivePartyStateStore((s) => s.status);
  const partyEndingState = useLivePartyStateStore((s) => s.partyEndingState);
  const { data: participantsData, isPending: isParticipantsPending } = useGetPartyParticipants(
    partyId,
    {
      enabled: isHost,
    },
  );
  const { mutate: startRealtimeEnd, data: startedEnd } = useStartRealtimeEnd();

  const participants = useMemo(() => participantsData?.participants ?? [], [participantsData]);
  const celebrant = participants.find((participant) => participant.isCelebrant);
  const guestCount = participants.filter((participant) => !participant.isCelebrant).length;
  const hasGuest = guestCount > 0;
  // 종료 관련 값은 WS(partyEndingState)가 실시간 브로드캐스트 + 재연결 시 party-state 스냅샷으로 채워준다.
  const endingStartedAt = partyEndingState?.endingStartedAt ?? startedEnd?.endingStartedAt ?? null;
  const endedAt = partyEndingState?.endedAt ?? null;
  const serverNow = partyEndingState?.serverNow ?? startedEnd?.serverNow ?? null;
  const serverClockOffsetMs = useMemo(() => getServerClockOffset(serverNow) ?? 0, [serverNow]);

  // 게스트가 한 번이라도 입장했는지 추적 — 입장 전 LIVE_ENDING 전환 방지
  const hadGuestsRef = useRef(false);

  // liveStartAt/status는 서버 푸시 없이 고정된 값과 현재 시각을 비교하는 것뿐이라
  // REST 폴링 대신 로컬 타이머로 1초마다 재평가한다(호스트가 혼자 대기 중일 때만).
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!isHost || hasGuest) return;

    const id = window.setInterval(() => setNowMs(Date.now()), TICK_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [isHost, hasGuest]);

  const started = hasLiveStarted(nowMs, liveStartAt, serverClockOffsetMs);
  const hasEnded = hasLiveEnded(nowMs, status, endedAt, serverClockOffsetMs);
  const remainingSeconds = getRemainingEndSeconds(nowMs, endingStartedAt, serverClockOffsetMs);

  useEffect(() => {
    if (hasGuest) hadGuestsRef.current = true;
  }, [hasGuest]);

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
  };
}
