import { PartyEntryStep } from '@/components/live-party/entry/PartyEntryStep';
import { type PartyStep } from '@/constants/live-party';
import { PartyMusicStep } from '@/components/live-party/music/PartyMusicStep';
import { PartyCandleStep } from '@/components/live-party/candle/PartyCandleStep';
import { PartyPinataStep } from '@/components/live-party/pinata/PartyPinataStep';
import { PartyEndStep } from '@/components/live-party/end/PartyEndStep';

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
