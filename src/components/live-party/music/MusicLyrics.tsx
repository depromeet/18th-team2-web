import { B1, Caption } from '@/components/ui/Typography';
import {
  getMusicLyrics,
  MUSIC_LYRICS_START_SECONDS,
  MUSIC_LYRICS_TIMINGS,
} from '@/constants/live-party';
import { usePartyStore } from '@/stores/usePartyStore';
import { useEffect, useRef, useState } from 'react';

interface MusicLyricsProps {
  onComplete?: () => void;
}

export function MusicLyrics({ onComplete }: MusicLyricsProps) {
  const hostName = usePartyStore((s) => s.hostName);
  const musicLyrics = getMusicLyrics(hostName);
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.max(
      MUSIC_LYRICS_TIMINGS.findIndex(
        ({ start, end }) =>
          MUSIC_LYRICS_START_SECONDS >= start && MUSIC_LYRICS_START_SECONDS <= end,
      ),
      0,
    ),
  );
  const startTimeRef = useRef(Date.now());
  const completedRef = useRef(false);

  useEffect(() => {
    const lastTiming = MUSIC_LYRICS_TIMINGS[MUSIC_LYRICS_TIMINGS.length - 1];

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000 + MUSIC_LYRICS_START_SECONDS;

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
  const nextLyric = musicLyrics[currentIndex + 1];

  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2">
      <B1
        key={currentIndex}
        as="p"
        className="text-[16px] leading-6 font-semibold text-white"
        style={{ animationDuration: `${lyricDuration}ms` }}
      >
        {musicLyrics[currentIndex]}
      </B1>

      {nextLyric && (
        <B1 as="p" className="text-[16px] leading-6 font-semibold text-white/50">
          {nextLyric}
        </B1>
      )}
      <Caption as="p" className="text-[10px] leading-[14px] text-white/50">
        Song : danmoo - birthday
      </Caption>
    </div>
  );
}
