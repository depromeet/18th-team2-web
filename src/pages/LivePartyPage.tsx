import { ChatBottomSheet } from '@/components/live-party/chat/ChatBottomSheet';
import { StepRenderer } from '@/components/live-party/StepRenderer';
import { PartyExitDialog } from '@/components/live-party/PartyExitDialog';
import { LivePartyHeader } from '@/components/live-party/LivePartyHeader';
import { usePartyExitDialog } from '@/hooks/live-party/usePartyExitDialog';
import { useLivePartyStep } from '@/hooks/live-party/usePartyStep';
import { usePartyMusic } from '@/hooks/live-party/usePartyMusic';
import { PartyMainBackground } from '@/components/live-party/main-background/PartyMainBackground';
import { LIVE_PARTY_STEP } from '@/constants/live-party';

export default function LivePartyPage() {
  const { isExitDialogOpen, handleOpenExitDialog, handleCancelExit, handleConfirmExit } =
    usePartyExitDialog();

  const { step, userRole, partyEnd, handleNextStep, isTransitioning } = useLivePartyStep();

  const { musicIsMuted, handleToggleMute } = usePartyMusic({ step });

  {
    /* 실제 음악 나오는 건 추후 개발 예정 */
  }
  const showPartyMain =
    step !== LIVE_PARTY_STEP.ENTRY &&
    step !== LIVE_PARTY_STEP.END &&
    step !== LIVE_PARTY_STEP.CANDLE;

  return (
    <div
      className={`relative h-svh w-full max-w-[598px] bg-cover bg-center bg-no-repeat ${partyEnd ? 'backdrop-blur-lg' : 'bg-blue-1000'} `}
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

      {showPartyMain && <PartyMainBackground userRole={userRole} />}
      <StepRenderer step={step} onStepComplete={handleNextStep} userRole={userRole} />
      {/** TODO: 전환효과 컴포넌트로 분리 */}
      <div
        aria-hidden
        className={`bg-blue-1000 pointer-events-none absolute inset-0 z-100 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {showPartyMain && <ChatBottomSheet />}
      <PartyExitDialog
        isOpen={isExitDialogOpen}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
