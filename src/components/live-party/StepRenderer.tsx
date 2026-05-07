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
      return (
        <div className="fixed bottom-[320px] left-0 right-0 z-10 mx-auto w-full max-w-[600px]">
          <PartyMusicText onComplete={onStepComplete} />
        </div>
      );
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
