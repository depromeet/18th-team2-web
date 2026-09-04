import { useEffect, useRef, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

import { CandleList } from '@/components/live-party/candle/CandleList';
import { CandleOverlay } from '@/components/live-party/candle/CandleOverlay';
import { CandleTitle } from '@/components/live-party/candle/CandleTitle';
import { Button } from '@/components/ui/Button';
import { CANDLES } from '@/constants/live-party';
import { useCandleStep } from '@/hooks/live-party/useCandleStep';
import { useFallConfetti } from '@/hooks/live-party/useFallConfetti';
import { WaitingHostActionOverlay } from './WaitingHostActionOverlay';

interface PartyCandleStepProps {
  onComplete?: () => void;
  onProcessComplete?: () => void;
  isHost: boolean;
}

export function PartyCandleStep({ onComplete, onProcessComplete, isHost }: PartyCandleStepProps) {
  const hasNotifiedCompleteRef = useRef(false);
  const { handleInitConfetti, fireConfetti } = useFallConfetti();

  const { isCandleOffList, allCandleOff, glowOpacity, handleClickCandle } = useCandleStep();

  const showHostNextButton = allCandleOff && isHost;

  const [readyForWaitingOverlay, setReadyForWaitingOverlay] = useState(false);
  const showWaitingOverlay = allCandleOff && !isHost && readyForWaitingOverlay;

  useEffect(() => {
    if (allCandleOff) {
      fireConfetti();
    }
  }, [allCandleOff, fireConfetti]);

  useEffect(() => {
    if (!allCandleOff) {
      setReadyForWaitingOverlay(false);
      return;
    }

    const timer = setTimeout(() => setReadyForWaitingOverlay(true), 2500);
    return () => clearTimeout(timer);
  }, [allCandleOff]);

  useEffect(() => {
    if (!allCandleOff) {
      hasNotifiedCompleteRef.current = false;
      return;
    }

    if (hasNotifiedCompleteRef.current) return;

    hasNotifiedCompleteRef.current = true;
    onProcessComplete?.();
  }, [allCandleOff, onProcessComplete]);

  return (
    <div className="bg-blue-1000 relative flex h-svh w-full max-w-150 flex-col items-center justify-center gap-12 overflow-hidden pt-14 [@media_(max-height:700px)]:gap-8 [@media_(max-height:700px)]:pt-10">
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
        <div className="absolute right-4 bottom-[calc(24px+env(safe-area-inset-bottom))] left-4 z-40 animate-[party-complete-fade-in_300ms_ease-out_forwards] [@media_(max-height:700px)]:bottom-[calc(16px+env(safe-area-inset-bottom))]">
          <Button onClick={onComplete}>다음</Button>
        </div>
      )}

      {showWaitingOverlay && <WaitingHostActionOverlay />}
    </div>
  );
}
