import { ChatBottomSheet } from '@/components/live-party/chat/ChatBottomSheet';
import { StepRenderer } from '@/components/live-party/StepRenderer';
import { PartyExitDialog } from '@/components/live-party/PartyExitDialog';
import { LivePartyHeader } from '@/components/live-party/LivePartyHeader';
import { usePartyExitDialog } from '@/hooks/live-party/usePartyExitDialog';
import { useLivePartyStep } from '@/hooks/live-party/usePartyStep';
import { usePartyMusic } from '@/hooks/live-party/usePartyMusic';

export default function LivePartyPage() {
  const { isExitDialogOpen, handleOpenExitDialog, handleCancelExit, handleConfirmExit } =
    usePartyExitDialog();

  const { step, userRole, partyEnd, showChatBottomSheet, handleNextStep, isTransitioning } =
    useLivePartyStep();

  const { musicIsMuted, handleToggleMute } = usePartyMusic({ step });

  return (
    <div
      className={`relative min-h-screen w-full max-w-[598px] bg-cover bg-center bg-no-repeat ${partyEnd ? 'backdrop-blur-lg' : 'bg-blue-1000'} `}
    >
      {!partyEnd && (
        <LivePartyHeader
          onNextStep={handleNextStep}
          onExitClick={handleOpenExitDialog}
          musicIsMuted={musicIsMuted}
          handleToggleMute={handleToggleMute}
          step={step}
        />
      )}

      <StepRenderer step={step} onStepComplete={handleNextStep} userRole={userRole} />
      <div
        aria-hidden
        className={`bg-blue-1000 pointer-events-none absolute inset-0 z-50 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {showChatBottomSheet && <ChatBottomSheet />}
      <PartyExitDialog
        isOpen={isExitDialogOpen}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
