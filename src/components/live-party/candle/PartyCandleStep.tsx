import { CANDLES } from '@/constants/live-party';
import { useState, useMemo } from 'react';
import { CandleList } from '@/components/live-party/candle/CandleList';
import { CandleOverlay } from '@/components/live-party/candle/CandleOverlay';
import { CandleTitle } from '@/components/live-party/candle/CandleTitle';

export function PartyCandleStep() {
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
      prev.map((isOff, currentIndex) => {
        if (currentIndex !== index) {
          return isOff;
        }

        return true;
      }),
    );
  };

  return (
    <div className="bg-blue-1000 relative flex h-screen w-full max-w-[600px] flex-col items-center justify-center gap-12 overflow-hidden pt-14">
      <CandleOverlay opacity={glowOpacity} />
      <CandleTitle allCandleOff={allCandleOff} />
      <CandleList
        candles={CANDLES}
        isCandleOffList={isCandleOffList}
        onClickCandle={handleClickCandle}
      />
    </div>
  );
}
