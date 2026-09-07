import { useCallback, useEffect, useRef, useState } from 'react';

import {
  LIVE_PARTY_STEP,
  MUSIC_LYRICS_TIMINGS,
  OVERLAY_FADE_DURATION,
  OVERLAY_TRANSITION_STEPS,
  STEP_DELAY_DURATION,
  type PartyStep,
} from '@/constants/live-party';
import {
  useGetPhase,
  useAdvancePhase,
  useRealtimePartyState,
  type PartyApiPhase,
} from '@/services/live-party';

const MUSIC_TO_CANDLE_ADVANCE_DELAY_MS = 1200;
const MUSIC_PHASE_DURATION_MS =
  MUSIC_LYRICS_TIMINGS[MUSIC_LYRICS_TIMINGS.length - 1].end * 1000 +
  MUSIC_TO_CANDLE_ADVANCE_DELAY_MS;

function apiPhaseToStep(phase: PartyApiPhase): PartyStep {
  switch (phase) {
    case 'ENTRY':
      return LIVE_PARTY_STEP.ENTRY;
    case 'MUSIC':
      return LIVE_PARTY_STEP.MUSIC;
    case 'CANDLE':
      return LIVE_PARTY_STEP.CANDLE;
    case 'BURST':
      return LIVE_PARTY_STEP.BURST_GAME;
    case 'CLOSEABLE':
      return LIVE_PARTY_STEP.CLOSEABLE;
    case 'END':
      return LIVE_PARTY_STEP.END;
  }
}

function stepToApiPhase(step: PartyStep): PartyApiPhase {
  switch (step) {
    case 'ENTRY':
      return 'ENTRY';
    case 'MUSIC':
      return 'MUSIC';
    case 'CANDLE':
      return 'CANDLE';
    case 'BURST_GAME':
      return 'BURST';
    case 'CLOSEABLE':
      return 'CLOSEABLE';
    case 'END':
      return 'END';
  }
}

function subtractDateTime(value: string | null | undefined, offsetMs: number) {
  if (!value) return null;

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) return null;

  return new Date(timestamp - offsetMs).toISOString();
}

function addDateTime(value: string | null | undefined, offsetMs: number) {
  if (!value) return null;

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) return null;

  return new Date(timestamp + offsetMs).toISOString();
}

function getRecoveredLiveStartAt(
  phase: PartyApiPhase,
  phaseStartedAt: string | null | undefined,
  fallbackLiveStartAt: string | null | undefined,
) {
  if (phase === 'MUSIC') {
    return phaseStartedAt ?? fallbackLiveStartAt;
  }

  if (phase === 'CANDLE') {
    return subtractDateTime(phaseStartedAt, MUSIC_PHASE_DURATION_MS) ?? fallbackLiveStartAt;
  }

  if (phase === 'BURST' || phase === 'CLOSEABLE') {
    return addDateTime(fallbackLiveStartAt, MUSIC_PHASE_DURATION_MS) ?? fallbackLiveStartAt;
  }

  return fallbackLiveStartAt;
}

interface UseLivePartyStepOptions {
  partyId: string;
  partyPhase?: PartyApiPhase | null;
  partyPhaseStartedAt?: string | null;
  serverNow?: string | null;
  isPartyEnded?: boolean;
  enabled?: boolean;
}

export function useLivePartyStep({
  partyId,
  partyPhase,
  partyPhaseStartedAt,
  serverNow,
  isPartyEnded,
  enabled = true,
}: UseLivePartyStepOptions) {
  const [step, setStep] = useState<PartyStep>(LIVE_PARTY_STEP.ENTRY);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isEntryReady, setIsEntryReady] = useState(false);
  const [liveStartedAt, setLiveStartedAt] = useState<string | null>(() =>
    partyId ? sessionStorage.getItem(`live-party-started-at:${partyId}`) : null,
  );
  const [liveStartedServerNow, setLiveStartedServerNow] = useState<string | null>(null);
  const stepRef = useRef<PartyStep>(LIVE_PARTY_STEP.ENTRY);

  const { data: phaseData, isError: isPhaseError } = useGetPhase(partyId, enabled);
  const { data: realtimeState } = useRealtimePartyState(partyId, enabled);
  const { mutate: advancePhase } = useAdvancePhase();

  const rememberLiveStart = useCallback(
    (startedAt?: string | null, serverNow?: string | null) => {
      if (!startedAt) return;

      setLiveStartedAt(startedAt);
      setLiveStartedServerNow(serverNow ?? null);

      if (partyId) {
        sessionStorage.setItem(`live-party-started-at:${partyId}`, startedAt);
      }
    },
    [partyId],
  );

  const clearRememberedLiveStart = useCallback(() => {
    setLiveStartedAt(null);
    setLiveStartedServerNow(null);

    if (partyId) {
      sessionStorage.removeItem(`live-party-started-at:${partyId}`);
    }
  }, [partyId]);

  const applyStepTransition = useCallback((nextStep: PartyStep) => {
    if (nextStep === stepRef.current) return;
    const currentStep = stepRef.current;

    if (OVERLAY_TRANSITION_STEPS.includes(currentStep)) {
      setIsTransitioning(true);
      window.setTimeout(() => {
        stepRef.current = nextStep;
        setStep(nextStep);
        window.setTimeout(() => {
          setIsTransitioning(false);
        }, STEP_DELAY_DURATION);
      }, OVERLAY_FADE_DURATION);
    } else {
      stepRef.current = nextStep;
      setStep(nextStep);
    }
  }, []);

  // 초기 phase 설정 (GET /phase)
  useEffect(() => {
    const phase = phaseData?.data?.phase;

    if (!phase || isInitialized) return;

    if (phase === 'ENTRY') {
      clearRememberedLiveStart();
    }

    if (phase === 'MUSIC') {
      rememberLiveStart(phaseData?.data?.phaseStartedAt, phaseData?.data?.serverNow);
    }

    const initialStep = apiPhaseToStep(phase);

    if (stepRef.current === LIVE_PARTY_STEP.ENTRY) {
      stepRef.current = initialStep;
      setStep(initialStep);
    }

    setIsInitialized(true);
  }, [phaseData, isInitialized, rememberLiveStart, clearRememberedLiveStart]);

  // 중간 입장/새로고침 복구: 현재 phase가 MUSIC 이후라면 전체 파티 시작 시각을 복구한다.
  useEffect(() => {
    const currentPhase = phaseData?.data?.phase ?? partyPhase ?? null;
    const currentPhaseStartedAt = phaseData?.data?.phaseStartedAt ?? partyPhaseStartedAt;
    const currentServerNow = phaseData?.data?.serverNow ?? serverNow ?? realtimeState?.serverNow;
    const liveStartAt = currentPhase
      ? getRecoveredLiveStartAt(currentPhase, currentPhaseStartedAt, realtimeState?.liveStartAt)
      : null;

    if (!currentPhase || currentPhase === 'ENTRY' || !liveStartAt) return;

    rememberLiveStart(liveStartAt, currentServerNow);
  }, [
    phaseData?.data?.phase,
    phaseData?.data?.phaseStartedAt,
    phaseData?.data?.serverNow,
    partyPhase,
    partyPhaseStartedAt,
    serverNow,
    realtimeState?.liveStartAt,
    realtimeState?.serverNow,
    rememberLiveStart,
  ]);

  // WebSocket party-phase-changed 반영
  useEffect(() => {
    if (!partyPhase) return;

    if (partyPhase === 'ENTRY') {
      clearRememberedLiveStart();
    }

    if (partyPhase === 'MUSIC') {
      rememberLiveStart(partyPhaseStartedAt, serverNow);
    }

    applyStepTransition(apiPhaseToStep(partyPhase));
    setIsInitialized(true);
  }, [
    partyPhase,
    partyPhaseStartedAt,
    serverNow,
    applyStepTransition,
    rememberLiveStart,
    clearRememberedLiveStart,
  ]);

  // 파티 중간 입장: entry 완료 후 현재 phase로 step 전환
  useEffect(() => {
    if (!isEntryReady) return;
    if (stepRef.current !== LIVE_PARTY_STEP.ENTRY) return;

    const phase = phaseData?.data?.phase ?? partyPhase ?? null;
    if (!phase || phase === 'ENTRY') return;

    const currentStep = apiPhaseToStep(phase);
    stepRef.current = currentStep;
    setStep(currentStep);
  }, [isEntryReady, phaseData, partyPhase]);

  // WebSocket party-ended 반영
  useEffect(() => {
    if (!isPartyEnded) return;
    stepRef.current = LIVE_PARTY_STEP.END;
    setStep(LIVE_PARTY_STEP.END);
    setIsInitialized(true);
  }, [isPartyEnded]);

  const handleEntryComplete = useCallback(() => {
    setIsTransitioning(true);
    window.setTimeout(() => {
      setIsEntryReady(true);
      window.setTimeout(() => {
        setIsTransitioning(false);
      }, STEP_DELAY_DURATION);
    }, OVERLAY_FADE_DURATION);
  }, []);

  const handleNextStep = useCallback(() => {
    if (!partyId) return;
    advancePhase(
      { partyId, currentPhase: stepToApiPhase(stepRef.current) },
      {
        onSuccess: (res) => {
          if (res.data?.phase === 'MUSIC') {
            rememberLiveStart(res.data.phaseStartedAt, res.data.serverNow);
          }
        },
      },
    );
  }, [advancePhase, partyId, rememberLiveStart]);

  const goToEndStep = useCallback(() => {
    setIsTransitioning(false);
    stepRef.current = LIVE_PARTY_STEP.END;
    setStep(LIVE_PARTY_STEP.END);
  }, []);

  const showChatBottomSheet =
    step !== LIVE_PARTY_STEP.ENTRY &&
    step !== LIVE_PARTY_STEP.END &&
    step !== LIVE_PARTY_STEP.CANDLE;

  const partyEnd = step === LIVE_PARTY_STEP.END;

  return {
    step,
    isTransitioning,
    isInitialized,
    isPhaseError,
    partyEnd,
    showChatBottomSheet,
    handleNextStep,
    handleEntryComplete,
    isEntryReady,
    goToEndStep,
    liveStartedAt,
    liveStartedServerNow,
  };
}
