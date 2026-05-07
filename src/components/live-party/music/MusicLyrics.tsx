import { B1, Caption } from '@/components/ui/Typography';
import { MUSIC_LYRICS } from '@/constants/live-party';
import { useEffect, useRef, useState } from 'react';

const LYRIC_TIMINGS = [
  { start: 0, end: 16 },
  { start: 17, end: 20 },
  { start: 21, end: 24 },
  { start: 25, end: 28 },
  { start: 29, end: 32 },
];

interface MusicLyricsProps {
  onComplete?: () => void;
}

export function MusicLyrics({ onComplete }: MusicLyricsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startTimeRef = useRef(Date.now());
  const completedRef = useRef(false);

  useEffect(() => {
    const lastTiming = LYRIC_TIMINGS[LYRIC_TIMINGS.length - 1];

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;

      if (elapsed > lastTiming.end && !completedRef.current) {
        completedRef.current = true;
        onComplete?.();
        clearInterval(interval);
        return;
      }

      const nextIndex = LYRIC_TIMINGS.findIndex(
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
    (LYRIC_TIMINGS[currentIndex].end - LYRIC_TIMINGS[currentIndex].start) * 1000;

  return (
    <div
      className="flex h-21 flex-col items-center justify-center gap-2 bg-white/1 backdrop-blur-xs"
      style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%)' }}
    >
      <B1
        key={currentIndex}
        as="p"
        className="music-text font-semibold text-white"
        style={{ animationDuration: `${lyricDuration}ms` }}
      >
        {MUSIC_LYRICS[currentIndex]}
      </B1>

      <Caption className="text-white/50">Song : danmoo - birthday</Caption>
    </div>
  );
}
