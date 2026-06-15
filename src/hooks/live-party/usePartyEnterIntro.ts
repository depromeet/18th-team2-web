import { useRef, useState, type MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';

import { getEntryData } from '@/constants/live-party';

interface UsePartyEnterIntroParams {
  hasCelebrant: boolean;
  isHost: boolean;
}

export function usePartyEnterIntro({ hasCelebrant, isHost }: UsePartyEnterIntroParams) {
  const location = useLocation();
  const hostName = (location.state as { hostName?: string } | null)?.hostName;

  const [step, setStep] = useState(0);

  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const [isCurtainOpen, setIsCurtainOpen] = useState(false);
  const [showHostNotEnter, setShowHostNotEnter] = useState(false);

  // 애니메이션 콜백 시점에서 최신 값을 읽기 위해 ref 사용
  const hasCelebrantRef = useRef(hasCelebrant);
  hasCelebrantRef.current = hasCelebrant;

  const entryData = getEntryData(hostName ?? '');
  const currentStep = entryData[step];

  const isLastStep = step === entryData.length - 1;

  const handleClick = () => {
    if (isLastStep || isExiting) return;

    setIsExiting(true);
  };

  const handleTextAnimationEnd = () => {
    if (isExiting) {
      const nextStep = step + 1;
      const isNextLastStep = nextStep === entryData.length - 1;

      setStep(nextStep);
      setIsExiting(false);

      // 마지막 step("두근두근")으로 진입할 때 주최자가 없으면 같은 렌더에서 HostNotEnter 전환
      if (isNextLastStep && !hasCelebrantRef.current && !isHost) {
        setShowHostNotEnter(true);
        setIsEntering(false);
        return;
      }

      setIsEntering(true);
      return;
    }

    setIsEntering(false);
  };

  const handleStart = (e: MouseEvent) => {
    e.stopPropagation();
    setIsCurtainOpen(true);
  };

  // 주최자 입장 시 HostNotEnter를 닫고 "두근두근" step으로 복귀
  const handleCelebrantEntered = () => {
    setShowHostNotEnter(false);
  };

  return {
    currentStep,
    isLastStep,
    isExiting,
    isEntering,
    isCurtainOpen,
    showHostNotEnter,
    handleClick,
    handleTextAnimationEnd,
    handleStart,
    handleCelebrantEntered,
  };
}
