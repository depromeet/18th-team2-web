import { useState, type MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';

import { getEntryData } from '@/constants/live-party';

export function usePartyEnterIntro() {
  const location = useLocation();
  const hostName = (location.state as { hostName?: string } | null)?.hostName;
  const [step, setStep] = useState(0);

  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const [isCurtainOpen, setIsCurtainOpen] = useState(false);

  const entryData = getEntryData(hostName ?? '');
  const currentStep = entryData[step];

  const isLastStep = step === entryData.length - 1;

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
