import { useState } from 'react';

import {
  LIVE_PARTY_STEP,
  LIVE_PARTY_STEP_ARRAY,
  PARTY_USER,
  type PartyStep,
  type PartyUserRole,
} from '@/constants/live-party';

export function useLivePartyStep() {
  const [step, setStep] = useState<PartyStep>(LIVE_PARTY_STEP.ENTRY);

  // 프리런칭 데이용 하드코딩
  const [userRole] = useState<PartyUserRole>(PARTY_USER.HOST);

  const handleNextStep = () => {
    const currentIndex = LIVE_PARTY_STEP_ARRAY.indexOf(step);
    const nextIndex = (currentIndex + 1) % LIVE_PARTY_STEP_ARRAY.length;

    setStep(LIVE_PARTY_STEP_ARRAY[nextIndex]);
  };

  const showChatBottomSheet =
    step !== LIVE_PARTY_STEP.ENTRY &&
    step !== LIVE_PARTY_STEP.END &&
    step !== LIVE_PARTY_STEP.CANDLE;

  const partyEnd = step === LIVE_PARTY_STEP.END;

  return {
    step,
    userRole,
    partyEnd,
    showChatBottomSheet,
    handleNextStep,
  };
}
