import { B1 } from '@/components/ui/Typography';
import { MUSIC_GUIDE_TEXT, MUSIC_GUIDE_TEXT_DURATION } from '@/constants/live-party';
import { useEffect, useState } from 'react';

export function MusicGuideText() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= MUSIC_GUIDE_TEXT.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, MUSIC_GUIDE_TEXT_DURATION);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="flex h-21 items-center justify-center px-6 text-center">
      <B1 key={currentIndex} className="music-text font-semibold text-white">
        {MUSIC_GUIDE_TEXT[currentIndex]}
      </B1>
    </div>
  );
}
