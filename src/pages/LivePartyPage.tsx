import { ChatBottomSheet } from '@/components/live-party/chat/ChatBottomSheet';
import { StepRenderer } from '@/components/live-party/StepRenderer';
import { PartyExitDialog } from '@/components/live-party/PartyExitDialog';
import { LivePartyHeader } from '@/components/live-party/LivePartyHeader';
import { usePartyExitDialog } from '@/hooks/live-party/usePartyExitDialog';
import { useLivePartyStep } from '@/hooks/live-party/usePartyStep';
import { usePartyUserRole } from '@/hooks/live-party/usePartyUserRole';
import { usePartyMusic } from '@/hooks/live-party/usePartyMusic';
import { useLivePartySSE } from '@/hooks/live-party/useLivePartySSE';
import { PartyMainBackground } from '@/components/live-party/main-background/PartyMainBackground';
import { LIVE_PARTY_STEP, PARTY_USER } from '@/constants/live-party';
import { TransitionEffect } from '@/components/live-party/TransitionEffect';
import { PartyFirecrackerEffect } from '@/components/live-party/chat/PartyFirecrackerEffect';

export default function LivePartyPage() {
  const { isExitDialogOpen, handleOpenExitDialog, handleCancelExit, handleConfirmExit } =
    usePartyExitDialog();

  const { step, partyEnd, handleNextStep, isTransitioning } = useLivePartyStep();
  const userRole = usePartyUserRole();

  const { musicIsMuted, handleToggleMute } = usePartyMusic({ step });

  const { messages, addMessage } = useLivePartySSE();

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
      {showPartyMain && <PartyMainBackground />}
      <StepRenderer step={step} onStepComplete={handleNextStep} userRole={userRole} />
      <TransitionEffect isTransitioning={isTransitioning} />
      {showPartyMain && <ChatBottomSheet messages={messages} onSend={addMessage} />}
      <PartyExitDialog
        isOpen={isExitDialogOpen}
        isHost={userRole === PARTY_USER.HOST}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
