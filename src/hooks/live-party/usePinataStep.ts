import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import characterBlueThumb from '@/assets/images/character/character-blue-circle-thumbnail.png';
import { PARTICIPANT_TOKEN_KEY } from '@/constants/live-party';
import { useBurstGameTaps } from '@/hooks/live-party/useBurstGameTaps';
import type { BurstGameState } from '@/hooks/live-party/useLivePartySSE';
import { useGetBurstGameState } from '@/services/live-party';
import { resolveImageUrl } from '@/utils/image';

export const PINATA_DURATION_SECONDS = 20;
export const PINATA_ONBOARDING_SECONDS = 5;
export const MAX_COLOR_TAP_COUNT = 100;
const CONTENT_ENTER_DELAY_MS = 420;
const TIMER_SYNC_INTERVAL_MS = 250;
const START_CUE_DURATION_MS = 900;
export const RANK_ROW_GAP = 40;

export interface PinataRanking {
  rank: number;
  nickname: string;
  tapCount: number;
  image: string;
  isMe?: boolean;
}

export type PinataOnboardingPhase = 'intro' | 'howToPlay' | 'start';

const EMPTY_RANKINGS: PinataRanking[] = [];

export function getPinataColor(tapCount: number) {
  const progress = Math.min(tapCount, MAX_COLOR_TAP_COUNT) / MAX_COLOR_TAP_COUNT;
  const start = { r: 88, g: 146, b: 255 };
  const end = { r: 239, g: 57, b: 60 };

  const r = Math.round(start.r + (end.r - start.r) * progress);
  const g = Math.round(start.g + (end.g - start.g) * progress);
  const b = Math.round(start.b + (end.b - start.b) * progress);

  return `rgb(${r}, ${g}, ${b})`;
}

export function formatRank(rank: number) {
  return `${rank}등`;
}

export function getPodiumColor(rank: number) {
  if (rank === 1) return '#FFC94D';
  if (rank === 2) return '#FFFFFF';
  if (rank === 3) return '#B8872B';
  return '#D7A43A';
}

function mapBurstGameRanking(
  ranking: NonNullable<BurstGameState['rankings']>[number],
  myParticipantId: number | undefined,
): PinataRanking {
  return {
    rank: ranking.rank,
    nickname: ranking.nickname,
    tapCount: ranking.tapCount,
    image: resolveImageUrl(ranking.characterImageUrl) ?? characterBlueThumb,
    isMe: ranking.participantId === myParticipantId,
  };
}

function getRankedParticipants(participants: PinataRanking[]) {
  let previousTapCount: number | null = null;
  let previousRank = 0;

  return participants
    .sort((a, b) => b.tapCount - a.tapCount)
    .map((participant, index) => {
      const rank = participant.tapCount === previousTapCount ? previousRank : index + 1;

      previousTapCount = participant.tapCount;
      previousRank = rank;

      return {
        ...participant,
        rank,
      };
    });
}

function parseDateTime(dateTime: string | undefined) {
  if (!dateTime) return null;

  const time = Date.parse(dateTime);

  return Number.isNaN(time) ? null : time;
}

interface UsePinataStepParams {
  burstGameState: BurstGameState | null;
}

export function usePinataStep({ burstGameState }: UsePinataStepParams) {
  const { partyId } = useParams<{ partyId: string }>();
  const participantToken = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
  const { queueTap, flushTaps } = useBurstGameTaps();
  const { data: recoveredBurstGameData } = useGetBurstGameState(partyId, participantToken);
  const [tapCount, setTapCount] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(PINATA_DURATION_SECONDS);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isResultAnimated, setIsResultAnimated] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isStartCueVisible, setIsStartCueVisible] = useState(false);
  const [startCountdownSeconds, setStartCountdownSeconds] = useState(PINATA_ONBOARDING_SECONDS);
  const [serverClockOffsetMs, setServerClockOffsetMs] = useState(0);
  const startCueTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const enterTimerId = window.setTimeout(() => {
      setIsContentVisible(true);
    }, CONTENT_ENTER_DELAY_MS);

    return () => window.clearTimeout(enterTimerId);
  }, []);

  const effectiveBurstGameState: BurstGameState | null =
    burstGameState ?? recoveredBurstGameData?.data ?? null;

  const displayTapCount = effectiveBurstGameState?.myTapCount ?? tapCount;
  const displayRemainingSeconds = remainingSeconds;
  const isServerEnded =
    effectiveBurstGameState?.ended === true || effectiveBurstGameState?.status === 'ENDED';

  useEffect(() => {
    const serverTime = parseDateTime(effectiveBurstGameState?.serverTime);

    if (serverTime == null) return;

    setServerClockOffsetMs(Date.now() - serverTime);
  }, [effectiveBurstGameState?.serverTime]);

  useEffect(() => {
    if (effectiveBurstGameState?.remainingSeconds == null) return;

    setRemainingSeconds(effectiveBurstGameState.remainingSeconds);
  }, [effectiveBurstGameState?.remainingSeconds]);

  useEffect(() => {
    if (!isContentVisible) return;

    const syncTimer = () => {
      const startedAt = parseDateTime(effectiveBurstGameState?.startedAt);
      const endsAt = parseDateTime(effectiveBurstGameState?.endsAt);

      if (startedAt == null || endsAt == null) {
        setIsGameStarted(false);
        setStartCountdownSeconds(PINATA_ONBOARDING_SECONDS);
        setRemainingSeconds(PINATA_DURATION_SECONDS);
        return;
      }

      const serverNow = Date.now() - serverClockOffsetMs;
      const hasStarted = serverNow >= startedAt;
      const secondsUntilStart = Math.max(0, Math.ceil((startedAt - serverNow) / 1000));

      setIsGameStarted((prev) => {
        if (!prev && hasStarted) {
          setIsStartCueVisible(true);

          if (startCueTimerRef.current != null) {
            window.clearTimeout(startCueTimerRef.current);
          }

          startCueTimerRef.current = window.setTimeout(() => {
            setIsStartCueVisible(false);
            startCueTimerRef.current = null;
          }, START_CUE_DURATION_MS);
        }

        return hasStarted;
      });
      setStartCountdownSeconds(secondsUntilStart);

      if (!hasStarted) {
        setRemainingSeconds(PINATA_DURATION_SECONDS);
        return;
      }

      setRemainingSeconds(Math.max(0, Math.ceil((endsAt - serverNow) / 1000)));
    };

    syncTimer();

    const timerId = window.setInterval(syncTimer, TIMER_SYNC_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, [
    effectiveBurstGameState?.endsAt,
    effectiveBurstGameState?.startedAt,
    isContentVisible,
    serverClockOffsetMs,
  ]);

  useEffect(() => {
    return () => {
      if (startCueTimerRef.current != null) {
        window.clearTimeout(startCueTimerRef.current);
      }
    };
  }, []);

  const serverRankings = useMemo(
    () =>
      (effectiveBurstGameState?.rankings ?? []).map((ranking) =>
        mapBurstGameRanking(ranking, effectiveBurstGameState?.myParticipantId),
      ),
    [effectiveBurstGameState?.myParticipantId, effectiveBurstGameState?.rankings],
  );

  const shouldUseServerRankings = effectiveBurstGameState != null;
  const allRankings = shouldUseServerRankings ? serverRankings : EMPTY_RANKINGS;

  const rankings = useMemo(
    () =>
      shouldUseServerRankings
        ? allRankings.slice(0, 3)
        : getRankedParticipants([...allRankings]).slice(0, 3),
    [allRankings, shouldUseServerRankings],
  );
  const resultRankings = useMemo(
    () => (shouldUseServerRankings ? allRankings : getRankedParticipants([...allRankings])),
    [allRankings, shouldUseServerRankings],
  );
  const totalTapCount = useMemo(
    () =>
      effectiveBurstGameState?.totalTapCount ??
      resultRankings.reduce((total, ranking) => total + ranking.tapCount, 0),
    [effectiveBurstGameState?.totalTapCount, resultRankings],
  );

  const topRankings = resultRankings.slice(0, 3);
  const restRankings = resultRankings.slice(3);
  const shouldShowResult = displayRemainingSeconds <= 0 || isServerEnded;

  useEffect(() => {
    if (!shouldShowResult || isResultVisible) return;

    flushTaps();
    setIsResultVisible(true);
  }, [flushTaps, isResultVisible, shouldShowResult]);

  useEffect(() => {
    if (!isResultVisible) return;

    const animationTimerId = window.setTimeout(() => {
      setIsResultAnimated(true);
    }, 1);

    return () => window.clearTimeout(animationTimerId);
  }, [isResultVisible]);

  const pinataColor = getPinataColor(displayTapCount);
  const progressPercent = (displayRemainingSeconds / PINATA_DURATION_SECONDS) * 100;
  const shouldShowOnboarding =
    isContentVisible && (!isGameStarted || isStartCueVisible) && !isResultVisible;
  const onboardingPhase: PinataOnboardingPhase = isStartCueVisible
    ? 'start'
    : startCountdownSeconds <= 2
      ? 'howToPlay'
      : 'intro';

  const handleTapPinata = () => {
    if (displayRemainingSeconds === 0 || !isContentVisible || !isGameStarted || isResultVisible) {
      return;
    }

    queueTap();
    setTapCount((prev) => prev + 1);
  };

  return {
    displayTapCount,
    displayRemainingSeconds,
    rankings,
    topRankings,
    restRankings,
    totalTapCount,
    isContentVisible,
    isGameStarted,
    shouldShowOnboarding,
    onboardingPhase,
    startCountdownSeconds,
    isResultVisible,
    isResultAnimated,
    pinataColor,
    progressPercent,
    handleTapPinata,
  };
}
