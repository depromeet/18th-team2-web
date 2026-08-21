import { useState, useEffect, type CSSProperties } from 'react';
import { MusicGuideText } from '@/components/live-party/music/MusicGuideText';
import { MusicLyrics } from '@/components/live-party/music/MusicLyrics';
import { MUSIC_GUIDE_DURATION } from '@/constants/live-party';

interface PartyMusicTextProps {
  onComplete?: () => void;
  bottomOffset?: number;
}

export function PartyMusicText({ onComplete, bottomOffset }: PartyMusicTextProps) {
  const [showLyrics, setShowLyrics] = useState(false);
  const isAboveExpandedChat = bottomOffset != null;
  const style = (
    !isAboveExpandedChat
      ? undefined
      : {
          bottom: `${bottomOffset}px`,
        }
  ) satisfies CSSProperties | undefined;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowLyrics(true);
    }, MUSIC_GUIDE_DURATION);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`fixed right-0 left-0 z-10 mx-auto h-[96px] w-full max-w-[600px] overflow-visible px-4 py-6 transition-[bottom] duration-300 ${
        isAboveExpandedChat ? '' : 'bottom-[var(--live-party-chat-min-height,283px)]'
      }`}
      style={style}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 z-0 bg-linear-to-b from-[#000341]/0 via-[#000341]/55 to-[#000341]/0 ${
          isAboveExpandedChat
            ? '-inset-y-7 bg-[#000341]/20 backdrop-blur-[12px]'
            : 'top-0 bottom-0 blur-[14px]'
        }`}
      />
      {showLyrics ? <MusicLyrics onComplete={onComplete} /> : <MusicGuideText />}
    </div>
  );
}
