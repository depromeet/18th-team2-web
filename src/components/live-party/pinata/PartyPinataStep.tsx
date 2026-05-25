import ReactCanvasConfetti from 'react-canvas-confetti';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import crownIcon from '@/assets/images/icons/crown.svg';
import characterBlueThumb from '@/assets/images/character/character-blue-circle-thumbnail.png';
import characterBrownThumb from '@/assets/images/character/character-brown-circle-thumbnail.png';
import characterPinkThumb from '@/assets/images/character/character-pink-circle-thumbnail.png';
import { Button } from '@/components/ui/Button';
import { CONFETTI_COLORS } from '@/constants/live-party';

const PINATA_DURATION_SECONDS = 20;
const MAX_COLOR_TAP_COUNT = 100;
const CONTENT_ENTER_DELAY_MS = 420;
const RANK_ROW_GAP = 40;
const RESULT_LIST_VISIBLE_COUNT = 5;
const RESULT_ROW_HEIGHT = 56;
const RESULT_ROW_GAP = 12;

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
  {
    rank: 4,
    nickname: '한송연애 윤녕아님',
    tapCount: 34,
    image: characterBlueThumb,
  },
  {
    rank: 5,
    nickname: '파티요정',
    tapCount: 28,
    image: characterPinkThumb,
  },
  {
    rank: 6,
    nickname: '축하장인',
    tapCount: 21,
    image: characterBrownThumb,
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

function getRankedParticipants(participants: PinataRanking[]) {
  let previousTapCount: number | null = null;
  let previousRank = 0;

  return participants
    .sort((a, b) => b.tapCount - a.tapCount)
    .map((participant, index) => {
      const rank = participant.tapCount === previousTapCount ? previousRank : index + 1;

      previousTapCount = participant.tapCount;
      previousRank = rank;

      return {
        ...participant,
        rank,
      };
    });
}

interface PartyPinataStepProps {
  onReturnToPartyRoom?: () => void;
}

export function PartyPinataStep({ onReturnToPartyRoom }: PartyPinataStepProps) {
  const confettiRef = useRef<((options: Record<string, unknown>) => void) | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(PINATA_DURATION_SECONDS);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isResultAnimated, setIsResultAnimated] = useState(false);
  const [isConfettiReady, setIsConfettiReady] = useState(false);

  const fireResultFireworks = useCallback(() => {
    const firework = () => {
      const x = 0.15 + Math.random() * 0.7;
      const y = 0.1 + Math.random() * 0.35;

      confettiRef.current?.({
        particleCount: 50,
        angle: 360,
        spread: 360,
        startVelocity: 20,
        gravity: 0.9,
        decay: 0.94,
        ticks: 220,
        scalar: 1.2,
        origin: { x, y },
        colors: CONFETTI_COLORS,
      });
    };

    firework();
    const timerId = window.setTimeout(firework, 400);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    const enterTimerId = window.setTimeout(() => {
      setIsContentVisible(true);
    }, CONTENT_ENTER_DELAY_MS);

    return () => window.clearTimeout(enterTimerId);
  }, []);

  useEffect(() => {
    if (!isContentVisible) return;

    const timerId = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerId);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isContentVisible]);

  const allRankings = useMemo(
    () => [
      ...MOCK_COMPETITORS,
      {
        rank: 0,
        nickname: '나',
        tapCount,
        image: characterBlueThumb,
        isMe: true,
      },
    ],
    [tapCount],
  );

  const rankings = useMemo(
    () => getRankedParticipants([...allRankings]).slice(0, 3),
    [allRankings],
  );
  const resultRankings = useMemo(() => getRankedParticipants([...allRankings]), [allRankings]);

  useEffect(() => {
    if (remainingSeconds > 0 || isResultVisible) return;

    setIsResultVisible(true);
  }, [isResultVisible, remainingSeconds]);

  useEffect(() => {
    if (!isResultVisible || !isConfettiReady) return;

    return fireResultFireworks();
  }, [fireResultFireworks, isConfettiReady, isResultVisible]);

  useEffect(() => {
    if (!isResultVisible) return;

    const animationTimerId = window.setTimeout(() => {
      setIsResultAnimated(true);
    }, 1);

    return () => window.clearTimeout(animationTimerId);
  }, [isResultVisible]);

  const pinataColor = getPinataColor(tapCount);
  const progressPercent = (remainingSeconds / PINATA_DURATION_SECONDS) * 100;

  const handleTapPinata = () => {
    if (remainingSeconds === 0 || !isContentVisible || isResultVisible) return;
    setTapCount((prev) => prev + 1);
  };

  if (isResultVisible) {
    return (
      <section className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center px-4 pt-[20.7svh] text-white">
        <ReactCanvasConfetti
          onInit={({ confetti }) => {
            confettiRef.current = confetti;
            setIsConfettiReady(true);
          }}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        />

        <h2
          className={`text-head-1 relative z-20 text-center font-bold whitespace-pre-line transition-transform duration-300 ease-out ${
            isResultAnimated ? 'scale-100' : 'scale-0'
          }`}
        >
          펑~{'\n'}박이 터졌어요!
        </h2>

        <div
          className={`scrollbar-hide pointer-events-auto relative z-20 mt-[11.7svh] flex max-h-[42svh] w-[320px] max-w-[calc(100vw-32px)] flex-col gap-3 overflow-y-auto transition-all duration-[600ms] ease-in-out ${
            isResultAnimated ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
          }`}
          style={{
            height:
              resultRankings.length > RESULT_LIST_VISIBLE_COUNT
                ? RESULT_LIST_VISIBLE_COUNT * RESULT_ROW_HEIGHT +
                  (RESULT_LIST_VISIBLE_COUNT - 1) * RESULT_ROW_GAP
                : undefined,
          }}
        >
          {resultRankings.map((ranking) => (
            <div
              key={`${ranking.nickname}-${ranking.isMe ? 'me' : 'participant'}`}
              className="text-grey-900 flex h-14 shrink-0 items-center gap-4 rounded-[12px] bg-white p-4 shadow-[0_6px_18px_rgba(255,255,255,0.16)]"
            >
              <div className="text-body-1 flex w-12 shrink-0 items-center gap-1 font-bold text-[#B8872B]">
                {ranking.rank === 1 ? (
                  <img src={crownIcon} alt="" className="h-[18px] w-[22px] shrink-0" />
                ) : null}
                <span>{formatRank(ranking.rank)}</span>
              </div>

              <img
                src={ranking.image}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />

              <span className="text-label-1 min-w-0 truncate font-semibold">
                {ranking.nickname}
              </span>

              <span className="text-body-1 ml-auto shrink-0 text-right font-bold text-blue-500">
                {ranking.tapCount}번
              </span>
            </div>
          ))}
        </div>

        <div
          className={`pointer-events-auto absolute right-4 bottom-[calc(46px+env(safe-area-inset-bottom))] left-4 z-20 transition-opacity duration-300 ${
            isResultAnimated ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Button onClick={onReturnToPartyRoom}>파티방으로 돌아가기</Button>
        </div>
      </section>
    );
  }

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
                key={`${ranking.nickname}-${ranking.isMe ? 'me' : 'participant'}`}
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
