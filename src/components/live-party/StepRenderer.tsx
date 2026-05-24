import { PartyEntryStep } from '@/components/live-party/entry/PartyEntryStep';
import { type PartyStep, type PartyUserRole } from '@/constants/live-party';
import { PartyCandleStep } from '@/components/live-party/candle/PartyCandleStep';
import { PartyPinataStep } from '@/components/live-party/pinata/PartyPinataStep';
import { PartyEndStep } from '@/components/live-party/end/PartyEndStep';
import { PartyMusicText } from '@/components/live-party/music/PartyMusicText';

interface StepRendererProps {
  step: PartyStep;
  onStepComplete?: () => void;
  userRole: PartyUserRole;
  hostName?: string;
  hostCharacterImage?: string | null;
}

export function StepRenderer({
  step,
  onStepComplete,
  userRole,
  hostName,
  hostCharacterImage,
}: StepRendererProps) {
  switch (step) {
    case 'ENTRY':
      return (
        <PartyEntryStep
          hostName={hostName}
          hostCharacterImage={hostCharacterImage}
          onComplete={onStepComplete}
        />
      );
    case 'MUSIC':
      return <PartyMusicText onComplete={onStepComplete} />;
    case 'CANDLE':
      return <PartyCandleStep onComplete={onStepComplete} />;
    case 'PINATA':
      return <PartyPinataStep />;
    case 'END':
      return <PartyEndStep role={userRole} />;
    default:
      return null;
  }
}
