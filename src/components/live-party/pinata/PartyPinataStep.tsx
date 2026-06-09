import ReactCanvasConfetti from 'react-canvas-confetti';
import { useCallback, useEffect, useRef, useState } from 'react';

import crownIcon from '@/assets/images/icons/crown.svg';
import { Button } from '@/components/ui/Button';
import { CONFETTI_COLORS } from '@/constants/live-party';
import {
  formatRank,
  getPodiumColor,
  type PinataRanking,
  RANK_ROW_GAP,
  usePinataStep,
} from '@/hooks/live-party/usePinataStep';
import type { BurstGameState } from '@/hooks/live-party/useLivePartySSE';

function CrownIcon({ color, className = '' }: { color: string; className?: string }) {
  return (
    <span
      className={`inline-block shrink-0 ${className}`}
      style={{
        backgroundColor: color,
        WebkitMask: `url(${crownIcon}) center / contain no-repeat`,
        mask: `url(${crownIcon}) center / contain no-repeat`,
      }}
      aria-hidden="true"
    />
  );
}

interface PartyPinataStepProps {
  onReturnToPartyRoom?: () => void;
  burstGameState: BurstGameState | null;
}

export function PartyPinataStep({ onReturnToPartyRoom, burstGameState }: PartyPinataStepProps) {
  const confettiRef = useRef<((options: Record<string, unknown>) => void) | null>(null);
  const {
    displayTapCount,
    displayRemainingSeconds,
    rankings,
    topRankings,
    restRankings,
    totalTapCount,
    isContentVisible,
    isGameStarted,
    isResultVisible,
    isResultAnimated,
    pinataColor,
    progressPercent,
    handleTapPinata,
  } = usePinataStep({ burstGameState });
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
    if (!isResultVisible || !isConfettiReady) return;

    return fireResultFireworks();
  }, [fireResultFireworks, isConfettiReady, isResultVisible]);

  if (isResultVisible) {
    const podiumSlots = [
      { ranking: topRankings[1], className: 'translate-y-5' },
      { ranking: topRankings[0], className: '-translate-y-3' },
      { ranking: topRankings[2], className: 'translate-y-5' },
    ].filter((slot): slot is { ranking: PinataRanking; className: string } =>
      Boolean(slot.ranking),
    );

    return (
      <section className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center overflow-hidden px-4 pt-[18.4svh] text-white">
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
          className={`relative z-20 mt-4 text-center transition-opacity duration-300 ${
            isResultAnimated ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-body-2 font-semibold text-white">
            모두 총 <span className="font-bold text-blue-300">{totalTapCount}회</span> 눌렀어요
          </p>
        </div>

        <div
          className={`relative z-20 mt-[7.3svh] flex w-full max-w-[342px] items-end justify-center gap-3 transition-all duration-[600ms] ease-in-out ${
            isResultAnimated ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
          }`}
        >
          {podiumSlots.map(({ ranking, className }) => {
            const rankColor = getPodiumColor(ranking.rank);

            return (
              <div
                key={`${ranking.nickname}-${ranking.isMe ? 'me' : 'participant'}`}
                className={`flex w-[100px] flex-col items-center ${className}`}
              >
                <div
                  className="text-body-1 flex items-center gap-1 font-bold"
                  style={{ color: rankColor }}
                >
                  <CrownIcon color={rankColor} className="h-[18px] w-[22px]" />
                  <span>{formatRank(ranking.rank)}</span>
                </div>

                <div className="text-grey-900 mt-2 flex h-[132px] w-full flex-col items-center rounded-[16px] bg-white px-2 py-4 text-center">
                  <img
                    src={ranking.image}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />

                  <span className="mt-3 block w-full overflow-hidden text-[12px] leading-4 font-semibold break-keep text-ellipsis whitespace-nowrap">
                    {ranking.nickname}
                  </span>

                  <span className="mt-1 text-[16px] leading-5 font-bold text-blue-500">
                    {ranking.tapCount}번
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`scrollbar-hide pointer-events-auto relative z-20 mt-14 mb-[calc(126px+env(safe-area-inset-bottom))] flex min-h-0 w-full max-w-[320px] flex-1 flex-col gap-5 overflow-y-auto transition-all duration-[600ms] ease-in-out ${
            isResultAnimated ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
          }`}
        >
          {restRankings.map((ranking) => (
            <div
              key={`${ranking.nickname}-${ranking.isMe ? 'me' : 'participant'}`}
              className="flex h-9 shrink-0 items-center gap-3 text-white"
            >
              <span className="text-body-1 w-5 shrink-0 font-bold">{ranking.rank}</span>

              <img
                src={ranking.image}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />

              <span className="text-label-1 min-w-0 truncate font-semibold">
                {ranking.nickname}
              </span>

              <span className="text-body-1 ml-auto shrink-0 text-right font-bold text-blue-300">
                {ranking.tapCount}번
              </span>
            </div>
          ))}
        </div>

        <div
          className={`pointer-events-auto absolute right-4 bottom-[calc(46px+env(safe-area-inset-bottom))] left-4 z-30 transition-opacity duration-300 ${
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
        {rankings.length === 0
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
        disabled={!isGameStarted}
        className="pointer-events-auto mt-10 flex aspect-square w-[min(63vw,236px)] items-center justify-center rounded-full text-[34px] leading-none font-bold text-white transition-[background-color,transform,box-shadow] duration-200 ease-out active:scale-[0.97]"
        style={{ backgroundColor: pinataColor }}
        onClick={handleTapPinata}
      >
        {displayTapCount}
      </button>

      <div className="mt-auto mb-[calc(54px+env(safe-area-inset-bottom))] w-full max-w-[311px]">
        <p className="text-body-1 text-center font-semibold">
          <span className="text-red-400">{displayRemainingSeconds}</span>초 남았어요
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
