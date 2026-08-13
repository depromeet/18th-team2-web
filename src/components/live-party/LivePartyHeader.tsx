import { memo } from 'react';

import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import musicPlayIcon from '@/assets/images/live-party/music-play.png';
import musicMutedIcon from '@/assets/images/live-party/music-muted.png';

interface LivePartyHeaderProps {
  onExitClick: () => void;
  showMuteButton: boolean;
  handleToggleMute: () => void;
  musicIsMuted: boolean;
}

export const LivePartyHeader = memo(function LivePartyHeader({
  onExitClick,
  showMuteButton,
  handleToggleMute,
  musicIsMuted,
}: LivePartyHeaderProps) {
  return (
    <header className="absolute top-0 right-0 left-0 z-70 flex items-center justify-between p-4">
      {showMuteButton && (
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
});
