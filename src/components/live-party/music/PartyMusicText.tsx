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
    <div className="fixed right-0 bottom-[320px] left-0 z-10 mx-auto h-21 w-full max-w-[600px] bg-white/1 mask-[linear-gradient(to_bottom,transparent_0%,black_35%)] backdrop-blur-xs">
      {showLyrics ? <MusicLyrics onComplete={onComplete} /> : <MusicGuideText />}
    </div>
  );
}
