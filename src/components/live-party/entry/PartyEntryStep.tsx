import { usePartyEnterIntro } from '@/hooks/live-party/usePartyEnterIntro';
import { PartyCurtain } from '@/components/live-party/entry/PartyCurtain';
import { PartyIntroContent } from '@/components/live-party/entry/PartyIntroContent';
import { PartyIntroFooter } from '@/components/live-party/entry/PartyIntroFooter';
import { PartyEnterStage } from '@/components/live-party/entry/PartyEnterStage';

export function PartyEntryStep() {
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
            <PartyIntroContent
              text={currentStep.text}
              isEntering={isEntering}
              isExiting={isExiting}
              onAnimationEnd={handleTextAnimationEnd}
            />
            <PartyIntroFooter showButton={!!currentStep.showButton} onStart={handleStart} />
          </>
        )}
        {isCurtainOpen && <PartyEnterStage />}
      </div>
    </div>
  );
}
