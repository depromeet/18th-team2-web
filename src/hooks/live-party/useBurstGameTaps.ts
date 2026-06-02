import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { PARTICIPANT_TOKEN_KEY } from '@/constants/live-party';
import { useSubmitBurstGameTaps } from '@/services/live-party';

const TAP_BATCH_INTERVAL_MS = 250;
const MAX_TAP_BATCH_COUNT = 30;

export function useBurstGameTaps() {
  const { partyId } = useParams<{ partyId: string }>();
  const { mutate: submitTaps } = useSubmitBurstGameTaps();

  const pendingTapCountRef = useRef(0);
  const clientSequenceRef = useRef(1);
  const flushTimerIdRef = useRef<number | null>(null);

  const clearFlushTimer = useCallback(() => {
    if (flushTimerIdRef.current == null) return;

    window.clearTimeout(flushTimerIdRef.current);
    flushTimerIdRef.current = null;
  }, []);

  const flushTaps = useCallback(() => {
    clearFlushTimer();

    if (!partyId || pendingTapCountRef.current === 0) {
      return;
    }

    const tapCount = Math.min(pendingTapCountRef.current, MAX_TAP_BATCH_COUNT);
    pendingTapCountRef.current -= tapCount;

    submitTaps({
      partyId,
      body: {
        tapCount,
        clientSequence: clientSequenceRef.current,
      },
      participantToken: sessionStorage.getItem(PARTICIPANT_TOKEN_KEY),
    });

    clientSequenceRef.current += 1;

    if (pendingTapCountRef.current > 0) {
      flushTimerIdRef.current = window.setTimeout(flushTaps, TAP_BATCH_INTERVAL_MS);
    }
  }, [clearFlushTimer, partyId, submitTaps]);

  const queueTap = useCallback(() => {
    pendingTapCountRef.current += 1;

    if (pendingTapCountRef.current >= MAX_TAP_BATCH_COUNT) {
      flushTaps();
      return;
    }

    if (flushTimerIdRef.current != null) {
      return;
    }

    flushTimerIdRef.current = window.setTimeout(flushTaps, TAP_BATCH_INTERVAL_MS);
  }, [flushTaps]);

  useEffect(() => clearFlushTimer, [clearFlushTimer]);

  return { queueTap, flushTaps };
}
