import { useState } from 'react';

import {
  LIVE_PARTY_STEP,
  LIVE_PARTY_STEP_ARRAY,
  OVERLAY_FADE_DURATION,
  OVERLAY_TRANSITION_STEPS,
  PARTY_USER,
  type PartyStep,
  type PartyUserRole,
} from '@/constants/live-party';

export function useLivePartyStep() {
  const [step, setStep] = useState<PartyStep>(LIVE_PARTY_STEP.ENTRY);

  // 프리런칭 데이용 하드코딩
  const [userRole] = useState<PartyUserRole>(PARTY_USER.HOST);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNextStep = () => {
    const currentIndex = LIVE_PARTY_STEP_ARRAY.indexOf(step);
    const nextStep = LIVE_PARTY_STEP_ARRAY[(currentIndex + 1) % LIVE_PARTY_STEP_ARRAY.length];

    if (OVERLAY_TRANSITION_STEPS.includes(step)) {
      setIsTransitioning(true);
      window.setTimeout(() => {
        setStep(nextStep);
        setTimeout(() => setIsTransitioning(false), 50);
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
