import { useState, type MouseEvent } from 'react';

import { getEntryData } from '@/constants/live-party';
import { usePartyStore } from '@/stores/usePartyStore';

export function usePartyEnterIntro() {
  const hostName = usePartyStore((s) => s.hostName);
  const entryData = getEntryData(hostName);

  const [step, setStep] = useState(0);

  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const [isCurtainOpen, setIsCurtainOpen] = useState(false);

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
