import { useState } from 'react';
import { SCENES } from '@/constants/party-enter-intro';
import { usePartyExitDialog } from '@/hooks/party/usePartyExitDialog';

export function usePartyEnterIntro() {
  const [step, setStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isCurtainOpen, setIsCurtainOpen] = useState(false);
  const exitDialog = usePartyExitDialog();

  const currentScene = SCENES[step];
  const isLastStep = step === SCENES.length - 1;

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
    currentScene,
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
