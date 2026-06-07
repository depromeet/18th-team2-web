import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { LIVE_PARTY_STEP, type PartyStep } from '@/constants/live-party';
import MusicPlayIconSvg from '@/assets/images/live-party/music-play.svg?react';
import MusicMutedIconSvg from '@/assets/images/live-party/music-muted.svg?react';

interface LivePartyHeaderProps {
  onExitClick: () => void;
  step: PartyStep;
  handleToggleMute: () => void;
  musicIsMuted: boolean;
}

export function LivePartyHeader({
  onExitClick,
  step,
  handleToggleMute,
  musicIsMuted,
}: LivePartyHeaderProps) {
  return (
    <header className="absolute top-0 right-0 left-0 z-30 flex items-center justify-between p-4">
      {step !== LIVE_PARTY_STEP.ENTRY && (
        <button onClick={handleToggleMute}>
          {musicIsMuted ? <MusicMutedIconSvg /> : <MusicPlayIconSvg />}
        </button>
      )}
      <button onClick={onExitClick} aria-label="파티 나가기" className="ml-auto">
        <CloseIcon className="text-white" />
      </button>
    </header>
  );
}
