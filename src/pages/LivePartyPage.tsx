import { ChatBottomSheet } from '@/components/live-party/chat/ChatBottomSheet';
import { StepRenderer } from '@/components/live-party/StepRenderer';
import { LIVE_PARTY_STEP, LIVE_PARTY_STEP_ARRAY, type PartyStep } from '@/constants/live-party';
import { useState } from 'react';
import livePartyBg from '@/assets/images/live-party/live-party-bg.png';
import { PartyExitDialog } from '@/components/live-party/PartyExitDialog';
import { LivePartyHeader } from '@/components/live-party/LivePartyHeader';
import { usePartyExitDialog } from '@/hooks/live-party/usePartyExitDialog';

export default function LivePartyPage() {
  const [step, setStep] = useState<PartyStep>('ENTRY');

  const handleNextStep = () => {
    const currentIndex = LIVE_PARTY_STEP_ARRAY.indexOf(step);
    const nextIndex = (currentIndex + 1) % LIVE_PARTY_STEP_ARRAY.length;
    setStep(LIVE_PARTY_STEP_ARRAY[nextIndex]);
  };

  const { isExitDialogOpen, handleOpenExitDialog, handleCancelExit, handleConfirmExit } =
    usePartyExitDialog();

  {
    /* 실시간 참여자를 보여줄 수 없기에 bg 임시  */
  }
  {
    /* 실제 음악 나오는 건 추후 개발 예정 */
  }
  return (
    <div
      className="relative min-h-screen w-full max-w-[598px] bg-cover bg-center bg-no-repeat backdrop-blur-lg"
      style={{
        backgroundImage: `url(${livePartyBg})`,
      }}
    >
      <LivePartyHeader onNextStep={handleNextStep} onExitClick={handleOpenExitDialog} step={step} />
      <StepRenderer step={step} onStepComplete={handleNextStep} />
      {step !== LIVE_PARTY_STEP.ENTRY && step !== LIVE_PARTY_STEP.CANDLE && <ChatBottomSheet />}
      <PartyExitDialog
        isOpen={isExitDialogOpen}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
