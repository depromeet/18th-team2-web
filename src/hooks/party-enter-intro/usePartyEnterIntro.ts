import { useState } from 'react';
import { SCENES } from '@/constants/party-enter-intro';
import { usePartyExitDialog } from '@/hooks/party/usePartyExitDialog';

export function usePartyEnterIntro() {
  const [step, setStep] = useState(0);
  const exitDialog = usePartyExitDialog();

  const currentScene = SCENES[step];
  const isLastStep = step === SCENES.length - 1;

  const handleClick = () => {
    if (isLastStep) return;
    setStep((prev) => prev + 1);
  };

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: 파티 입장
  };

  return {
    step,
    currentScene,
    isLastStep,
    handleClick,
    handleStart,
    ...exitDialog,
  };
}
