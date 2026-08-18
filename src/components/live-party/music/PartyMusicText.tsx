import { useState, useEffect } from 'react';
import { MusicGuideText } from '@/components/live-party/music/MusicGuideText';
import { MusicLyrics } from '@/components/live-party/music/MusicLyrics';
import { MUSIC_GUIDE_DURATION } from '@/constants/live-party';

interface PartyMusicTextProps {
  onComplete?: () => void;
}

export function PartyMusicText({ onComplete }: PartyMusicTextProps) {
  const [showLyrics, setShowLyrics] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowLyrics(true);
    }, MUSIC_GUIDE_DURATION);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed right-0 bottom-[var(--live-party-chat-min-height,283px)] left-0 z-10 mx-auto h-[96px] w-full max-w-[600px] overflow-visible px-4 py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0 bg-linear-to-b from-[#000341]/0 via-[#000341]/42 to-[#000341]/0 blur-[14px]"
      />
      {showLyrics ? <MusicLyrics onComplete={onComplete} /> : <MusicGuideText />}
    </div>
  );
}
