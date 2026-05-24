import { useState } from 'react';

import {
  LIVE_PARTY_STEP,
  LIVE_PARTY_STEP_ARRAY,
  OVERLAY_FADE_DURATION,
  OVERLAY_TRANSITION_STEPS,
  PARTY_USER,
  STEP_DELAY_DURATION,
  type PartyStep,
  type PartyUserRole,
} from '@/constants/live-party';

interface UseLivePartyStepOptions {
  initialStep?: PartyStep;
  initialUserRole?: PartyUserRole;
  onEntryComplete?: () => void;
}

export function useLivePartyStep({
  initialStep = LIVE_PARTY_STEP.ENTRY,
  initialUserRole = PARTY_USER.PARTICIPANT_NOT_WRITTEN,
  onEntryComplete,
}: UseLivePartyStepOptions = {}) {
  const [step, setStep] = useState<PartyStep>(initialStep);
  const userRole = initialUserRole;
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNextStep = () => {
    const currentIndex = LIVE_PARTY_STEP_ARRAY.indexOf(step);
    const nextStep = LIVE_PARTY_STEP_ARRAY[(currentIndex + 1) % LIVE_PARTY_STEP_ARRAY.length];
    if (step === LIVE_PARTY_STEP.ENTRY) {
      onEntryComplete?.();
    }

    if (OVERLAY_TRANSITION_STEPS.includes(step)) {
      setIsTransitioning(true);
      window.setTimeout(() => {
        setStep(nextStep);

        window.setTimeout(() => {
          setIsTransitioning(false);
        }, STEP_DELAY_DURATION);
      }, OVERLAY_FADE_DURATION);
    } else {
      setStep(nextStep);
    }
  };

  const showChatBottomSheet =
    step !== LIVE_PARTY_STEP.ENTRY &&
    step !== LIVE_PARTY_STEP.END &&
    step !== LIVE_PARTY_STEP.CANDLE;

  const partyEnd = step === LIVE_PARTY_STEP.END;

  return {
    step,
    userRole,
    isTransitioning,
    partyEnd,
    showChatBottomSheet,
    handleNextStep,
  };
}
