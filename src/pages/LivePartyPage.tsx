import { ChatBottomSheet } from '@/components/live-party/chat/ChatBottomSheet';
import { StepRenderer } from '@/components/live-party/StepRenderer';
import { Button } from '@/components/ui/Button';
import { type PartyStep } from '@/constants/live-party';
import { useState } from 'react';

const STEP_ORDER: PartyStep[] = ['ENTRY', 'MUSIC', 'CANDLE', 'PINATA', 'END'];

export default function LivePartyPage() {
  const [step, setStep] = useState<PartyStep>('ENTRY');

  const handleNextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(step);
    const nextIndex = (currentIndex + 1) % STEP_ORDER.length;
    setStep(STEP_ORDER[nextIndex]);
  };

  return (
    <div className="bg-blue-1000 min-h-screen">
      <StepRenderer step={step} />
      <Button onClick={handleNextStep}>다음 스텝</Button>
      {/* 채팅 */}
      {step !== 'ENTRY' && <ChatBottomSheet />}
    </div>
  );
}
