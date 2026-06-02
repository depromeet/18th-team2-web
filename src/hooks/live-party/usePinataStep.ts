import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import characterBlueThumb from '@/assets/images/character/character-blue-circle-thumbnail.png';
import { PARTICIPANT_TOKEN_KEY } from '@/constants/live-party';
import { useBurstGameTaps } from '@/hooks/live-party/useBurstGameTaps';
import type { BurstGameState } from '@/hooks/live-party/useLivePartySSE';
import { useGetBurstGameState, useStartBurstGame } from '@/services/live-party';
import { isApiErrorStatus } from '@/utils/api-error';
import { resolveImageUrl } from '@/utils/image';

export const PINATA_DURATION_SECONDS = 20;
export const MAX_COLOR_TAP_COUNT = 100;
const CONTENT_ENTER_DELAY_MS = 420;
export const RANK_ROW_GAP = 40;

export interface PinataRanking {
  rank: number;
  nickname: string;
  tapCount: number;
  image: string;
  isMe?: boolean;
}

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

interface UsePinataStepParams {
  burstGameState: BurstGameState | null;
}

export function usePinataStep({ burstGameState }: UsePinataStepParams) {
  const { partyId } = useParams<{ partyId: string }>();
  const participantToken = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
  const { queueTap, flushTaps } = useBurstGameTaps();
  const {
    data: recoveredBurstGameData,
    error: recoverError,
    isError,
  } = useGetBurstGameState(partyId, participantToken);
  const { mutate: startBurstGame, data: startedBurstGameData } = useStartBurstGame();
  const [tapCount, setTapCount] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(PINATA_DURATION_SECONDS);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isResultAnimated, setIsResultAnimated] = useState(false);

  useEffect(() => {
    const enterTimerId = window.setTimeout(() => {
      setIsContentVisible(true);
    }, CONTENT_ENTER_DELAY_MS);

    return () => window.clearTimeout(enterTimerId);
  }, []);

  useEffect(() => {
    if (!isContentVisible) return;

    const timerId = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerId);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isContentVisible]);

  useEffect(() => {
    if (
      !partyId ||
      burstGameState ||
      recoveredBurstGameData?.data ||
      startedBurstGameData?.data ||
      !isError ||
      !isApiErrorStatus(recoverError, 404)
    ) {
      return;
    }

    startBurstGame({
      partyId,
      participantToken,
    });
  }, [
    burstGameState,
    isError,
    partyId,
    participantToken,
    recoverError,
    recoveredBurstGameData?.data,
    startBurstGame,
    startedBurstGameData?.data,
  ]);

  const startedBurstGameState = useMemo<BurstGameState | null>(() => {
    if (!startedBurstGameData?.data) return null;

    return {
      ...startedBurstGameData.data,
      ended: false,
      status: 'ACTIVE',
    };
  }, [startedBurstGameData?.data]);

  const effectiveBurstGameState: BurstGameState | null =
    burstGameState ?? recoveredBurstGameData?.data ?? startedBurstGameState;

  const displayTapCount = effectiveBurstGameState?.myTapCount ?? tapCount;
  const displayRemainingSeconds = effectiveBurstGameState?.remainingSeconds ?? remainingSeconds;
  const isServerEnded =
    effectiveBurstGameState?.ended === true || effectiveBurstGameState?.status === 'ENDED';

  useEffect(() => {
    if (effectiveBurstGameState?.remainingSeconds == null) return;

    setRemainingSeconds(effectiveBurstGameState.remainingSeconds);
  }, [effectiveBurstGameState?.remainingSeconds]);

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

  const handleTapPinata = () => {
    if (displayRemainingSeconds === 0 || !isContentVisible || isResultVisible) return;
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
    isResultVisible,
    isResultAnimated,
    pinataColor,
    progressPercent,
    handleTapPinata,
  };
}
