import { PartyEntryStep } from '@/components/live-party/entry/PartyEntryStep';
import { type PartyStep } from '@/constants/live-party';
import { PartyCandleStep } from '@/components/live-party/candle/PartyCandleStep';
import { PartyPinataStep } from '@/components/live-party/pinata/PartyPinataStep';
import { PartyEndStep } from '@/components/live-party/end/PartyEndStep';
import { PartyMusicText } from './music/PartyMusicText';

interface StepRendererProps {
  step: PartyStep;
  onStepComplete?: () => void;
}

export function StepRenderer({ step, onStepComplete }: StepRendererProps) {
  switch (step) {
    case 'ENTRY':
      return <PartyEntryStep />;
    case 'MUSIC':
      return <PartyMusicText onComplete={onStepComplete} />;
    case 'CANDLE':
      return <PartyCandleStep onComplete={onStepComplete} />;
    case 'PINATA':
      return <PartyPinataStep />;
    case 'END':
      return <PartyEndStep />;
    default:
      return null;
  }
}
