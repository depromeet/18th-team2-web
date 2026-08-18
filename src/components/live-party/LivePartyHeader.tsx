import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { LIVE_PARTY_STEP, type PartyStep } from '@/constants/live-party';
import musicPlayIcon from '@/assets/images/live-party/music-play.png';
import musicMutedIcon from '@/assets/images/live-party/music-muted.png';

interface LivePartyHeaderProps {
  onExitClick: () => void;
  step: PartyStep;
  handleToggleMute: () => void;
  musicIsMuted: boolean;
  forceShowMusicButton?: boolean;
}

export function LivePartyHeader({
  onExitClick,
  step,
  handleToggleMute,
  musicIsMuted,
  forceShowMusicButton = false,
}: LivePartyHeaderProps) {
  const showMusicButton = forceShowMusicButton || step !== LIVE_PARTY_STEP.ENTRY;

  return (
    <header className="absolute top-0 right-0 left-0 z-[70] flex items-center justify-between p-4">
      {showMusicButton && (
        <button onClick={handleToggleMute}>
          {musicIsMuted ? (
            <img
              src={musicMutedIcon}
              alt="음악 음소거"
              className="h-9 w-9 transform-[translateZ(0)]"
            />
          ) : (
            <img
              src={musicPlayIcon}
              alt="음악 재생"
              className="h-9 w-9 transform-[translateZ(0)]"
            />
          )}
        </button>
      )}
      <button onClick={onExitClick} aria-label="파티 나가기" className="ml-auto">
        <CloseIcon className="text-white" />
      </button>
    </header>
  );
}
