import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCENES } from '@/constants/party-enter-intro';
import { ROUTES } from '@/constants/routes';

export function usePartyEnterIntro() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const currentScene = SCENES[step];
  const isLastStep = step === SCENES.length - 1;

  const handleClick = () => {
    if (isLastStep) return;
    setStep((prev) => prev + 1);
  };

  const handleClose = () => {
    navigate(ROUTES.home);
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
    handleClose,
    handleStart,
  };
}
