import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CANDLES, PARTICIPANT_TOKEN_KEY } from '@/constants/live-party';
import { useBlowCandle, useGetCandleBlowState } from '@/services/live-party';
import type { components } from '@/types/api';

interface useCandleStepParams {
  candleBlowState: components['schemas']['CandleBlowResponse'] | null;
}

export function useCandleStep({ candleBlowState }: useCandleStepParams) {
  const { partyId } = useParams<{ partyId: string }>();

  const [optimisticOffIds, setOptimisticOffIds] = useState<Set<number>>(new Set());

  const { mutate: blowCandle } = useBlowCandle();

  const { data: initialData } = useGetCandleBlowState(partyId);

  const initialCandles = useMemo(
    () => initialData?.data?.candles ?? [],
    [initialData?.data?.candles],
  );

  const serverCandles = useMemo(
    () => candleBlowState?.candles ?? initialCandles,
    [candleBlowState?.candles, initialCandles],
  );

  const isCandleOffList = useMemo(
    () =>
      CANDLES.map((_, index) => {
        const candleId = index + 1;

        const serverOff = serverCandles.find((c) => c.candleId === candleId)?.extinguished ?? false;

        return serverOff || optimisticOffIds.has(candleId);
      }),
    [serverCandles, optimisticOffIds],
  );

  // 진짜 모든 촛불이 꺼졌는지 체크
  const allCandleOff =
    serverCandles.length > 0 && serverCandles.every((candle) => candle.extinguished);

  const glowOpacity = 1 - Math.floor(isCandleOffList.filter(Boolean).length / 3) / 3;

  const handleClickCandle = (index: number) => {
    const candleId = index + 1;

    setOptimisticOffIds((prev) => new Set([...prev, candleId]));

    blowCandle({
      partyId: partyId!,
      candleId,
      participantToken: sessionStorage.getItem(PARTICIPANT_TOKEN_KEY),
    });
  };

  return {
    allCandleOff,
    glowOpacity,
    isCandleOffList,
    handleClickCandle,
  };
}
