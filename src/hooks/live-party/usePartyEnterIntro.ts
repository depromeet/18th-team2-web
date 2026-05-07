import { useState, type MouseEvent } from 'react';

import { ENTRY_DATA } from '@/constants/live-party';

export function usePartyEnterIntro() {
  const [step, setStep] = useState(0);

  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const [isCurtainOpen, setIsCurtainOpen] = useState(false);

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

      return;
    }

    setIsEntering(false);
  };

  const handleStart = (e: MouseEvent) => {
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
  };
}
