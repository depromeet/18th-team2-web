import { PartyEntryStep } from './entry/PartyEntryStep';
import { type PartyStep } from '@/constants/live-party';
import { PartyMusicStep } from './music/PartyMusicStep';
import { PartyCandleStep } from './candle/PartyCandleStep';
import { PartyPinataStep } from './pinata/PartyPinataStep';
import { PartyEndStep } from './end/PartyEndStep';

interface StepRendererProps {
  step: PartyStep;
}

export function StepRenderer({ step }: StepRendererProps) {
  switch (step) {
    case 'ENTRY':
      return <PartyEntryStep />;
    case 'MUSIC':
      return <PartyMusicStep />;
    case 'CANDLE':
      return <PartyCandleStep />;
    case 'PINATA':
      return <PartyPinataStep />;
    case 'END':
      return <PartyEndStep />;
    default:
      return null;
  }
}
