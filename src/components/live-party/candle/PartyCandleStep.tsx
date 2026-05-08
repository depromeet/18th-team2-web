import { CANDLES } from '@/constants/live-party';
import { useState, useMemo } from 'react';
import { CandleList } from '@/components/live-party/candle/CandleList';
import { CandleOverlay } from '@/components/live-party/candle/CandleOverlay';
import { CandleTitle } from '@/components/live-party/candle/CandleTitle';
import { Button } from '@/components/ui/Button';

interface PartyCandleStepProps {
  onComplete?: () => void;
}

export function PartyCandleStep({ onComplete }: PartyCandleStepProps) {
  const [isCandleOffList, setIsCandleOffList] = useState<boolean[]>(() =>
    Array(CANDLES.length).fill(false),
  );

  const offCount = useMemo(
    () => isCandleOffList.filter(Boolean).length,

    [isCandleOffList],
  );

  const allCandleOff = offCount === CANDLES.length;

  const glowOpacity = 1 - Math.floor(offCount / 3) / 3;

  const handleClickCandle = (index: number) => {
    setIsCandleOffList((prev) =>
      prev.map((isOff, currentIndex) => currentIndex === index || isOff),
    );
  };

  {
    /* TODO: 촛불이 다 꺼졌을 경우 컨페티 요소+애니메이션 추가 필요 */
  }
  return (
    <div className="bg-blue-1000 relative flex h-screen w-full max-w-[600px] flex-col items-center justify-center gap-12 overflow-hidden pt-14">
      <CandleOverlay opacity={glowOpacity} />
      <CandleTitle allCandleOff={allCandleOff} />
      <CandleList
        candles={CANDLES}
        isCandleOffList={isCandleOffList}
        onClickCandle={handleClickCandle}
      />
      {allCandleOff && (
        <div className="absolute right-4 bottom-8 left-4 animate-[party-complete-fade-in_300ms_ease-out_forwards]">
          <Button onClick={onComplete}>다음</Button>
        </div>
      )}
    </div>
  );
}
