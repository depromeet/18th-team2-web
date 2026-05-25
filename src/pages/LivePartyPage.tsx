import { ChatBottomSheet } from '@/components/live-party/chat/ChatBottomSheet';
import { StepRenderer } from '@/components/live-party/StepRenderer';
import { PartyExitDialog } from '@/components/live-party/PartyExitDialog';
import { LivePartyHeader } from '@/components/live-party/LivePartyHeader';
import { usePartyExitDialog } from '@/hooks/live-party/usePartyExitDialog';
import { useLivePartyStep } from '@/hooks/live-party/usePartyStep';
import { usePartyMusic } from '@/hooks/live-party/usePartyMusic';
import { PartyMainBackground } from '@/components/live-party/main-background/PartyMainBackground';
import { LIVE_PARTY_STEP } from '@/constants/live-party';
import { TransitionEffect } from '@/components/live-party/TransitionEffect';
import { PartyFirecrackerEffect } from '@/components/live-party/chat/PartyFirecrackerEffect';

export default function LivePartyPage() {
  const { isExitDialogOpen, handleOpenExitDialog, handleCancelExit, handleConfirmExit } =
    usePartyExitDialog();

  const { step, userRole, partyEnd, handleNextStep, isTransitioning } = useLivePartyStep();

  const { musicIsMuted, handleToggleMute } = usePartyMusic({ step });
  const isPinataStep = step === LIVE_PARTY_STEP.PINATA;

  const showPartyMain =
    step !== LIVE_PARTY_STEP.ENTRY &&
    step !== LIVE_PARTY_STEP.END &&
    step !== LIVE_PARTY_STEP.CANDLE;

  return (
    <div
      className={`relative h-svh w-full max-w-[600px] bg-cover bg-center bg-no-repeat ${partyEnd ? 'backdrop-blur-lg' : 'bg-blue-1000'} `}
    >
      {showPartyMain && <PartyFirecrackerEffect />}
      {!partyEnd && (
        <LivePartyHeader
          onNextStep={handleNextStep}
          onExitClick={handleOpenExitDialog}
          musicIsMuted={musicIsMuted}
          handleToggleMute={handleToggleMute}
          step={step}
        />
      )}
      {showPartyMain && <PartyMainBackground userRole={userRole} isBlurred={isPinataStep} />}
      <StepRenderer step={step} onStepComplete={handleNextStep} userRole={userRole} />
      <TransitionEffect isTransitioning={isTransitioning} />
      {showPartyMain && <ChatBottomSheet isBlurred={isPinataStep} />}
      <PartyExitDialog
        isOpen={isExitDialogOpen}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
