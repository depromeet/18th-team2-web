import { useCallback, useEffect, useRef, useState } from 'react';

import {
  LIVE_PARTY_STEP,
  OVERLAY_FADE_DURATION,
  OVERLAY_TRANSITION_STEPS,
  STEP_DELAY_DURATION,
  type PartyStep,
} from '@/constants/live-party';
import { useGetPhase, useAdvancePhase, type PartyApiPhase } from '@/services/live-party';

function apiPhaseToStep(phase: PartyApiPhase): PartyStep {
  switch (phase) {
    case 'ENTRY':
      return LIVE_PARTY_STEP.ENTRY;
    case 'MUSIC':
      return LIVE_PARTY_STEP.MUSIC;
    case 'CANDLE':
      return LIVE_PARTY_STEP.CANDLE;
    case 'BURST':
      return LIVE_PARTY_STEP.PINATA;
    case 'CLOSEABLE':
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
    case 'PINATA':
      return 'BURST';
    case 'END':
      return 'END';
  }
}

interface UseLivePartyStepOptions {
  partyId: string;
  ssePhase?: PartyApiPhase | null;
  isPartyEnded?: boolean;
  enabled?: boolean;
}

export function useLivePartyStep({
  partyId,
  ssePhase,
  isPartyEnded,
  enabled = true,
}: UseLivePartyStepOptions) {
  const [step, setStep] = useState<PartyStep>(LIVE_PARTY_STEP.ENTRY);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const stepRef = useRef<PartyStep>(LIVE_PARTY_STEP.ENTRY);

  const { data: phaseData } = useGetPhase(partyId, enabled);
  const { mutate: advancePhase } = useAdvancePhase();

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

    const initialStep = apiPhaseToStep(phase);

    if (stepRef.current !== LIVE_PARTY_STEP.ENTRY) {
      return;
    }

    stepRef.current = initialStep;
    setStep(initialStep);
    setIsInitialized(true);
  }, [phaseData, isInitialized]);

  // SSE party-phase-changed 반영
  useEffect(() => {
    if (!ssePhase) return;
    applyStepTransition(apiPhaseToStep(ssePhase));
  }, [ssePhase, applyStepTransition]);

  // SSE party-ended 반영
  useEffect(() => {
    if (!isPartyEnded) return;
    stepRef.current = LIVE_PARTY_STEP.END;
    setStep(LIVE_PARTY_STEP.END);
  }, [isPartyEnded]);

  const handleNextStep = () => {
    if (!partyId) return;
    advancePhase({ partyId, currentPhase: stepToApiPhase(stepRef.current) });
  };

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
    partyEnd,
    showChatBottomSheet,
    handleNextStep,
    goToEndStep,
  };
}
