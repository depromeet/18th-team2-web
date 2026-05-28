import { B1, Caption } from '@/components/ui/Typography';
import { getMusicLyrics, MUSIC_LYRICS_TIMINGS } from '@/constants/live-party';
import { usePartyStore } from '@/stores/usePartyStore';
import { useEffect, useRef, useState } from 'react';

interface MusicLyricsProps {
  onComplete?: () => void;
}

export function MusicLyrics({ onComplete }: MusicLyricsProps) {
  const hostName = usePartyStore((s) => s.hostName);
  const musicLyrics = getMusicLyrics(hostName);
  const [currentIndex, setCurrentIndex] = useState(0);
  const startTimeRef = useRef(Date.now());
  const completedRef = useRef(false);

  useEffect(() => {
    const lastTiming = MUSIC_LYRICS_TIMINGS[MUSIC_LYRICS_TIMINGS.length - 1];

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;

      if (elapsed > lastTiming.end && !completedRef.current) {
        completedRef.current = true;
        onComplete?.();
        clearInterval(interval);
        return;
      }

      const nextIndex = MUSIC_LYRICS_TIMINGS.findIndex(
        ({ start, end }) => elapsed >= start && elapsed <= end,
      );

      if (nextIndex !== -1) {
        setCurrentIndex(nextIndex);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [onComplete]);

  const lyricDuration =
    (MUSIC_LYRICS_TIMINGS[currentIndex].end - MUSIC_LYRICS_TIMINGS[currentIndex].start) * 1000;

  return (
    <div className="flex h-21 flex-col items-center justify-center gap-2 bg-white/1 mask-[linear-gradient(to_bottom,transparent_0%,black_35%)] backdrop-blur-xs">
      <B1
        key={currentIndex}
        as="p"
        className="music-text font-semibold text-white"
        style={{ animationDuration: `${lyricDuration}ms` }}
      >
        {musicLyrics[currentIndex]}
      </B1>

      <Caption className="text-white/50">Song : danmoo - birthday</Caption>
    </div>
  );
}
