import { useState } from 'react';
import { usePartyExitDialog } from '@/hooks/live-party/usePartyExitDialog';
import { ENTRY_DATA } from '@/constants/live-party';

export function usePartyEnterIntro() {
  const [step, setStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isCurtainOpen, setIsCurtainOpen] = useState(false);
  const exitDialog = usePartyExitDialog();

  const currentStep = ENTRY_DATA[step];
  const isLastStep = step === ENTRY_DATA.length - 1;

  const handleClick = () => {
    if (isLastStep || isExiting) return;
    setIsExiting(true);
  };

  const handleTextAnimationEnd = () => {
    if (isExiting) {
      setStep((prev) => prev + 1);
      setIsExiting(false);
      setIsEntering(true);
    } else {
      setIsEntering(false);
    }
  };

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCurtainOpen(true);
  };

  return {
    step,
    currentStep,
    isLastStep,
    isExiting,
    isEntering,
    isCurtainOpen,
    handleClick,
    handleTextAnimationEnd,
    handleStart,
    ...exitDialog,
  };
}
