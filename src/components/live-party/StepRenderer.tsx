import { PartyEntryStep } from '@/components/live-party/entry/PartyEntryStep';
import { type PartyStep, type PartyUserRole } from '@/constants/live-party';
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
  showPinataOverlay?: boolean;
  onReturnToPartyRoom?: () => void;
  isHost: boolean;
  userRole: PartyUserRole;
  endAction?: RealtimePartyNextActionResult | null;
  endHostName?: string;
  candleBlowState: components['schemas']['CandleBlowResponse'] | null;
  burstGameState: BurstGameState | null;
}

export function StepRenderer({
  step,
  onStepComplete,
  showPinataOverlay = true,
  onReturnToPartyRoom,
  isHost,
  userRole,
  endAction,
  endHostName,
  candleBlowState,
  burstGameState,
}: StepRendererProps) {
  switch (step) {
    case 'ENTRY':
      return <PartyEntryStep onComplete={onStepComplete} />;
    case 'MUSIC':
      return <PartyMusicText onComplete={onStepComplete} />;
    case 'CANDLE':
      return (
        <PartyCandleStep
          isHost={isHost}
          onComplete={onStepComplete}
          candleBlowState={candleBlowState}
        />
      );
    case 'PINATA':
      return showPinataOverlay ? (
        <PartyPinataStep
          onReturnToPartyRoom={onReturnToPartyRoom}
          burstGameState={burstGameState}
        />
      ) : null;
    case 'END':
      return <PartyEndStep role={userRole} action={endAction} hostName={endHostName} />;
    default:
      return null;
  }
}
