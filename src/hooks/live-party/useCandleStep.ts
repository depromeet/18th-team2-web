import { useMemo, useState } from 'react';

interface useCandleStepParams {
  candleCount: number;
  onComplete?: () => void;
}

export function useCandleStep({ candleCount, onComplete }: useCandleStepParams) {
  const [isCandleOffList, setIsCandleOffList] = useState<boolean[]>(() =>
    Array(candleCount).fill(false),
  );

  const offCount = useMemo(() => isCandleOffList.filter(Boolean).length, [isCandleOffList]);

  const allCandleOff = offCount === candleCount;

  const glowOpacity = 1 - Math.floor(offCount / 3) / 3;

  const handleClickCandle = (index: number) => {
    setIsCandleOffList((prev) => {
      const next = prev.map((isOff, currentIndex) => currentIndex === index || isOff);

      const nextOffCount = next.filter(Boolean).length;

      if (nextOffCount === candleCount) {
        onComplete?.();
      }

      return next;
    });
  };

  return {
    allCandleOff,
    glowOpacity,
    isCandleOffList,
    handleClickCandle,
  };
}
