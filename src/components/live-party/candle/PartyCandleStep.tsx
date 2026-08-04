import { useEffect } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

import { CandleList } from '@/components/live-party/candle/CandleList';
import { CandleOverlay } from '@/components/live-party/candle/CandleOverlay';
import { CandleTitle } from '@/components/live-party/candle/CandleTitle';
import { Button } from '@/components/ui/Button';
import { CANDLES } from '@/constants/live-party';
import { useCandleStep } from '@/hooks/live-party/useCandleStep';
import { useFallConfetti } from '@/hooks/live-party/useFallConfetti';
import type { components } from '@/types/api';
import { WaitingHostActionOverlay } from './WaitingHostActionOverlay';

interface PartyCandleStepProps {
  onComplete?: () => void;
  candleBlowState: components['schemas']['CandleBlowResponse'] | null;
  isHost: boolean;
}

export function PartyCandleStep({ onComplete, candleBlowState, isHost }: PartyCandleStepProps) {
  const { handleInitConfetti, fireConfetti } = useFallConfetti();

  const { isCandleOffList, allCandleOff, glowOpacity, handleClickCandle } = useCandleStep({
    candleBlowState,
  });

  const showHostNextButton = allCandleOff && isHost;
  const showWaitingOverlay = allCandleOff && !isHost;

  useEffect(() => {
    if (allCandleOff) {
      fireConfetti();
    }
  }, [allCandleOff, fireConfetti]);

  return (
    <div className="bg-blue-1000 relative flex h-svh w-full max-w-[600px] flex-col items-center justify-center gap-12 overflow-hidden pt-14">
      <ReactCanvasConfetti
        onInit={handleInitConfetti}
        className="pointer-events-none absolute inset-0 z-30 h-full w-full"
      />

      <CandleOverlay opacity={glowOpacity} />

      <CandleTitle allCandleOff={allCandleOff} />

      <CandleList
        candles={CANDLES}
        isCandleOffList={isCandleOffList}
        onClickCandle={handleClickCandle}
      />

      {showHostNextButton && (
        <div className="absolute right-4 bottom-8 left-4 z-40 animate-[party-complete-fade-in_300ms_ease-out_forwards]">
          <Button onClick={onComplete}>다음</Button>
        </div>
      )}

      {showWaitingOverlay && <WaitingHostActionOverlay />}
    </div>
  );
}
