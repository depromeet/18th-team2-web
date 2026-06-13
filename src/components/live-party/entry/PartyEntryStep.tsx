import { useEffect } from 'react';
import { usePartyEnterIntro } from '@/hooks/live-party/usePartyEnterIntro';
import { PartyCurtain } from '@/components/live-party/entry/PartyCurtain';
import { PartyEntryContent } from '@/components/live-party/entry/PartyEntryContent';
import { PartyEntryFooter } from '@/components/live-party/entry/PartyEntryFooter';
import { PartyEntryStage } from '@/components/live-party/entry/PartyEntryStage';

interface PartyEntryStepProps {
  onComplete?: () => void;
}

export function PartyEntryStep({ onComplete }: PartyEntryStepProps) {
  const {
    currentStep,
    isLastStep,
    isExiting,
    isEntering,
    isCurtainOpen,
    handleClick,
    handleTextAnimationEnd,
    handleStart,
  } = usePartyEnterIntro();

  useEffect(() => {
    if (!isCurtainOpen) return;

    const timer = window.setTimeout(() => {
      onComplete?.();
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isCurtainOpen, onComplete]);

  return (
    <div
      className={`relative h-svh w-full overflow-hidden bg-radial from-[#3D7AE9] to-[#6174FF] ${
        isCurtainOpen ? 'cursor-default' : 'cursor-pointer'
      }`}
      onClick={handleClick}
    >
      <div className="relative mx-auto h-full w-full max-w-[600px]">
        <div
          className={`absolute inset-0 z-1 bg-black transition-opacity duration-500 ${
            isLastStep ? 'opacity-0' : 'opacity-50'
          }`}
        />
        <PartyCurtain isOpen={isCurtainOpen} />
        {!isCurtainOpen && (
          <>
            <PartyEntryContent
              text={currentStep.text}
              isEntering={isEntering}
              isExiting={isExiting}
              onAnimationEnd={handleTextAnimationEnd}
            />
            <PartyEntryFooter showButton={!!currentStep.showButton} onStart={handleStart} />
          </>
        )}
        {isCurtainOpen && <PartyEntryStage />}
      </div>
    </div>
  );
}
