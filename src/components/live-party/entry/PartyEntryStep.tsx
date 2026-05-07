import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { PartyExitDialog } from '@/components/live-party/PartyExitDialog';
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
    isExitDialogOpen,
    handleClick,
    handleOpenExitDialog,
    handleCancelExit,
    handleConfirmExit,
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
        <header className="absolute top-0 right-0 left-0 z-11 flex justify-end p-4">
          <button onClick={handleOpenExitDialog} aria-label="파티 나가기">
            <CloseIcon className="text-white" />
          </button>
        </header>
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

      <PartyExitDialog
        isOpen={isExitDialogOpen}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
