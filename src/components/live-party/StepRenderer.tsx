import { memo, useCallback } from 'react';

import { PartyEntryStep } from '@/components/live-party/entry/PartyEntryStep';
import { LIVE_PARTY_STEP, type PartyStep, type PartyUserRole } from '@/constants/live-party';
import { PartyCandleStep } from '@/components/live-party/candle/PartyCandleStep';
import { PartyBurstGameStep } from '@/components/live-party/burst-game/PartyBurstGameStep';
import { PartyEndStep } from '@/components/live-party/end/PartyEndStep';
import { PartyMusicText } from '@/components/live-party/music/PartyMusicText';
import type { RealtimePartyNextActionResult } from '@/services/live-party';

interface StepRendererProps {
  step: PartyStep;
  onStepComplete?: () => void;
  onProcessComplete?: (step: PartyStep) => void;
  showBurstGameOverlay?: boolean;
  onReturnToPartyRoom?: () => void;
  isHost: boolean;
  userRole: PartyUserRole;
  endAction?: RealtimePartyNextActionResult | null;
  endHostName?: string;
  musicTextBottomOffset?: number;
}

export const StepRenderer = memo(function StepRenderer({
  step,
  onStepComplete,
  onProcessComplete,
  showBurstGameOverlay = true,
  onReturnToPartyRoom,
  isHost,
  userRole,
  endAction,
  endHostName,
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
        />
      );
    case 'BURST_GAME':
      return showBurstGameOverlay ? (
        <PartyBurstGameStep
          onReturnToPartyRoom={onReturnToPartyRoom}
          onProcessComplete={() => onProcessComplete?.(LIVE_PARTY_STEP.BURST_GAME)}
        />
      ) : null;
    case 'CLOSEABLE':
      return null;
    case 'END':
      return <PartyEndStep role={userRole} action={endAction} hostName={endHostName} />;
    default:
      return null;
  }
});
