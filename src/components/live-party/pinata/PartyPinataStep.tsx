import { useEffect, useMemo, useState } from 'react';

import characterBlueThumb from '@/assets/images/character/character-blue-circle-thumbnail.png';
import characterBrownThumb from '@/assets/images/character/character-brown-circle-thumbnail.png';
import characterPinkThumb from '@/assets/images/character/character-pink-circle-thumbnail.png';

const PINATA_DURATION_SECONDS = 20;
const MAX_COLOR_TAP_COUNT = 100;
const CONTENT_ENTER_DELAY_MS = 420;
const RANK_ROW_GAP = 40;

interface PinataRanking {
  rank: number;
  nickname: string;
  tapCount: number;
  image: string;
  isMe?: boolean;
}

const MOCK_COMPETITORS: PinataRanking[] = [
  {
    rank: 1,
    nickname: '오지탐험',
    tapCount: 65,
    image: characterBrownThumb,
  },
  {
    rank: 2,
    nickname: '나랑께',
    tapCount: 45,
    image: characterBlueThumb,
  },
  {
    rank: 3,
    nickname: '너만의자기',
    tapCount: 40,
    image: characterPinkThumb,
  },
];

function getPinataColor(tapCount: number) {
  const progress = Math.min(tapCount, MAX_COLOR_TAP_COUNT) / MAX_COLOR_TAP_COUNT;
  const start = { r: 88, g: 146, b: 255 };
  const end = { r: 239, g: 57, b: 60 };

  const r = Math.round(start.r + (end.r - start.r) * progress);
  const g = Math.round(start.g + (end.g - start.g) * progress);
  const b = Math.round(start.b + (end.b - start.b) * progress);

  return `rgb(${r}, ${g}, ${b})`;
}

function formatRank(rank: number) {
  return `${rank}등`;
}

export function PartyPinataStep() {
  const [tapCount, setTapCount] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(PINATA_DURATION_SECONDS);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const enterTimerId = window.setTimeout(() => {
      setIsContentVisible(true);
    }, CONTENT_ENTER_DELAY_MS);

    return () => window.clearTimeout(enterTimerId);
  }, []);

  useEffect(() => {
    if (!isContentVisible) return;

    const timerId = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isContentVisible]);

  const rankings = useMemo(() => {
    if (tapCount === 0) return [];

    return [
      ...MOCK_COMPETITORS,
      {
        rank: 0,
        nickname: '나',
        tapCount,
        image: characterBlueThumb,
        isMe: true,
      },
    ]
      .sort((a, b) => b.tapCount - a.tapCount)
      .slice(0, 3)
      .map((ranking, index) => ({ ...ranking, rank: index + 1 }));
  }, [tapCount]);

  const pinataColor = getPinataColor(tapCount);
  const progressPercent = (remainingSeconds / PINATA_DURATION_SECONDS) * 100;

  const handleTapPinata = () => {
    if (remainingSeconds === 0 || !isContentVisible) return;
    setTapCount((prev) => prev + 1);
  };

  return (
    <section
      className={`pointer-events-none absolute inset-0 z-[60] flex flex-col items-center px-8 pt-[17.2svh] text-white transition-opacity duration-500 ease-out ${
        isContentVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className="text-head-1 text-center font-bold whitespace-pre-line">
        주인공을 축하하는 마음으로{'\n'}박을 터뜨려볼까요?
      </h2>

      <div className="relative mt-8 h-[104px] w-full max-w-[311px]">
        {tapCount === 0
          ? [1, 2, 3].map((rank) => (
              <div
                key={rank}
                className="absolute left-0 grid h-7 w-full grid-cols-[32px_1fr_42px] items-center gap-2"
                style={{ transform: `translateY(${(rank - 1) * RANK_ROW_GAP}px)` }}
              >
                <span className={rank === 1 ? 'text-blue-300' : 'text-grey-300'}>
                  {formatRank(rank)}
                </span>
                <span className="text-grey-100">-</span>
              </div>
            ))
          : rankings.map((ranking) => (
              <div
                key={ranking.nickname}
                className="absolute left-0 grid h-7 w-full grid-cols-[32px_1fr_42px] items-center gap-2 transition-transform duration-300 ease-out"
                style={{ transform: `translateY(${(ranking.rank - 1) * RANK_ROW_GAP}px)` }}
              >
                <span className={ranking.rank === 1 ? 'text-blue-300' : 'text-grey-300'}>
                  {formatRank(ranking.rank)}
                </span>

                <div className="flex min-w-0 items-center gap-2">
                  <img
                    src={ranking.image}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <span className="text-label-2 truncate font-semibold">{ranking.nickname}</span>
                </div>

                <span className="text-label-1 text-right font-semibold">{ranking.tapCount}번</span>
              </div>
            ))}
      </div>

      <button
        type="button"
        className="pointer-events-auto mt-10 flex aspect-square w-[min(63vw,236px)] items-center justify-center rounded-full text-[34px] leading-none font-bold text-white transition-[background-color,transform,box-shadow] duration-200 ease-out active:scale-[0.97]"
        style={{ backgroundColor: pinataColor }}
        onClick={handleTapPinata}
      >
        {tapCount}
      </button>

      <div className="mt-auto mb-[calc(54px+env(safe-area-inset-bottom))] w-full max-w-[311px]">
        <p className="text-body-1 text-center font-semibold">
          <span className="text-red-400">{remainingSeconds}</span>초 남았어요
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-red-600 transition-[width] duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
