import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { WS_EVENT } from '@/constants/live-party';
import type { components } from '@/types/api';

export type CandleBlowState = components['schemas']['CandleBlowResponse'];

interface LivePartyCandleState {
  candleBlowState: CandleBlowState | null;
  setCandleBlowState: (state: CandleBlowState) => void;
  reset: () => void;
}

export const useLivePartyCandleStore = create<LivePartyCandleState>()(
  devtools(
    (set) => ({
      candleBlowState: null,

      setCandleBlowState: (state) => set({ candleBlowState: state }, false, 'setCandleBlowState'),

      reset: () => set({ candleBlowState: null }, false, 'reset'),
    }),
    { name: 'LivePartyCandleStore' },
  ),
);

/** 촛불끄기 관련 WS 이벤트를 해석해 스토어에 반영. 처리한 이벤트면 true. */
export function applyCandleWsEvent(event: string, parsed: Record<string, unknown>) {
  switch (event) {
    case WS_EVENT.CANDLE_BLOW_STARTED:
    case WS_EVENT.CANDLE_BLOW_PROGRESS:
    case WS_EVENT.CANDLE_BLOW_ENDED:
      useLivePartyCandleStore.getState().setCandleBlowState(parsed as CandleBlowState);
      return true;

    default:
      return false;
  }
}
