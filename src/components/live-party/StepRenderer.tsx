import { useCallback } from 'react';

import { PartyEntryStep } from '@/components/live-party/entry/PartyEntryStep';
import { LIVE_PARTY_STEP, type PartyStep, type PartyUserRole } from '@/constants/live-party';
import { PartyCandleStep } from '@/components/live-party/candle/PartyCandleStep';
import { PartyPinataStep } from '@/components/live-party/pinata/PartyPinataStep';
import { PartyEndStep } from '@/components/live-party/end/PartyEndStep';
import { PartyMusicText } from '@/components/live-party/music/PartyMusicText';
import type { BurstGameState } from '@/hooks/live-party/useLivePartySSE';
import type { RealtimePartyNextActionResult } from '@/services/live-party';
import type { components } from '@/types/api';

interface StepRendererProps {
  step: PartyStep;
  onStepComplete?: () => void;
  onProcessComplete?: (step: PartyStep) => void;
  showPinataOverlay?: boolean;
  onReturnToPartyRoom?: () => void;
  isHost: boolean;
  userRole: PartyUserRole;
  endAction?: RealtimePartyNextActionResult | null;
  endHostName?: string;
  candleBlowState: components['schemas']['CandleBlowResponse'] | null;
  burstGameState: BurstGameState | null;
  musicTextBottomOffset?: number;
}

export function StepRenderer({
  step,
  onStepComplete,
  onProcessComplete,
  showPinataOverlay = true,
  onReturnToPartyRoom,
  isHost,
  userRole,
  endAction,
  endHostName,
  candleBlowState,
  burstGameState,
  musicTextBottomOffset,
}: StepRendererProps) {
  const handleMusicComplete = useCallback(() => {
    onProcessComplete?.(LIVE_PARTY_STEP.MUSIC);

    window.setTimeout(() => {
      onStepComplete?.();
    }, 1200);
  }, [onProcessComplete, onStepComplete]);

  switch (step) {
    case 'ENTRY':
      return <PartyEntryStep onComplete={onStepComplete} isHost={isHost} />;
    case 'MUSIC':
      return (
        <PartyMusicText onComplete={handleMusicComplete} bottomOffset={musicTextBottomOffset} />
      );
    case 'CANDLE':
      return (
        <PartyCandleStep
          isHost={isHost}
          onComplete={onStepComplete}
          onProcessComplete={() => onProcessComplete?.(LIVE_PARTY_STEP.CANDLE)}
          candleBlowState={candleBlowState}
        />
      );
    case 'PINATA':
      return showPinataOverlay ? (
        <PartyPinataStep
          onReturnToPartyRoom={onReturnToPartyRoom}
          onProcessComplete={() => onProcessComplete?.(LIVE_PARTY_STEP.PINATA)}
          burstGameState={burstGameState}
        />
      ) : null;
    case 'CLOSEABLE':
      return null;
    case 'END':
      return <PartyEndStep role={userRole} action={endAction} hostName={endHostName} />;
    default:
      return null;
  }
}
