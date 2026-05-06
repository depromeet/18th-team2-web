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
    <div className="relative min-h-screen w-full max-w-[598px] bg-[url('/src/assets/images/live-party-bg.png')] bg-cover bg-center bg-no-repeat backdrop-blur-lg">
      {/* 실시간 참여자를 보여줄 수 없기에 bg 임시  */}
      <StepRenderer step={step} />
      {/* 파티 진행 확인을 위한 임시 버튼 */}
      <Button onClick={handleNextStep}>다음 스텝</Button>
      {/* 채팅 */}
      {step !== 'ENTRY' && <ChatBottomSheet />}
    </div>
  );
}
