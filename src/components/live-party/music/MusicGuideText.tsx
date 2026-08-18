import { B1 } from '@/components/ui/Typography';
import { MUSIC_GUIDE_TEXT, MUSIC_GUIDE_TEXT_DURATION } from '@/constants/live-party';
import { useEffect, useState } from 'react';

export function MusicGuideText() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= MUSIC_GUIDE_TEXT.length - 1) return;

    const timer = window.setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, MUSIC_GUIDE_TEXT_DURATION);

    return () => window.clearTimeout(timer);
  }, [currentIndex]);

  const text = MUSIC_GUIDE_TEXT[currentIndex];
  const renderText = () => {
    if (text.includes('해제')) {
      const [prefix, suffix] = text.split('해제');

      return (
        <>
          {prefix}
          <span className="text-[#5892ff]">해제</span>
          {suffix}
        </>
      );
    }

    if (text.includes('촛불끄기, 박 터뜨리기')) {
      return (
        <>
          노래가 끝난 후에는
          <br />
          <span className="text-[#5892ff]">촛불끄기, 박 터뜨리기</span> 게임도 준비되어 있어요
        </>
      );
    }

    return text;
  };

  return (
    <div className="relative z-10 flex h-full items-center justify-center px-2 text-center">
      <B1 key={currentIndex} className="text-[16px] leading-6 font-semibold text-white">
        {renderText()}
      </B1>
    </div>
  );
}
