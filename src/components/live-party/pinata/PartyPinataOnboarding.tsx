import pinataBurstImage from '@/assets/images/live-party/pinata-burst.png';
import pinataCardImage from '@/assets/images/live-party/pinata-card.png';
import type { PinataOnboardingPhase } from '@/hooks/live-party/usePinataStep';

interface PartyPinataOnboardingProps {
  phase: PinataOnboardingPhase;
  countdownSeconds: number;
}

export function PartyPinataOnboarding({ phase, countdownSeconds }: PartyPinataOnboardingProps) {
  if (phase === 'start') {
    return (
      <section className="pointer-events-auto absolute inset-0 z-[60] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[6px]" />
        <h2 className="relative text-[40px] leading-none font-bold">Start!</h2>
      </section>
    );
  }

  return (
    <section className="pointer-events-auto absolute inset-0 z-[60] flex flex-col items-center bg-[linear-gradient(180deg,#3042FF_0%,#5A95FF_100%)] text-white">
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ease-in-out ${
          phase === 'intro' ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden={phase !== 'intro'}
      >
        <h2 className="absolute top-[clamp(128px,20.8svh,169px)] left-1/2 h-16 w-[295px] -translate-x-1/2 text-center text-[24px] leading-8 font-bold tracking-[0] whitespace-pre-line">
          이번에는 주인공을 위해{'\n'}다 같이 박을 터뜨려볼까요?
        </h2>

        <img
          src={pinataBurstImage}
          alt=""
          className="absolute top-[clamp(232px,32.9svh,267px)] left-1/2 size-[clamp(208px,32svh,260px)] -translate-x-1/2 object-contain"
        />
      </div>

      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ease-in-out ${
          phase === 'howToPlay' ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden={phase !== 'howToPlay'}
      >
        <h2 className="absolute top-[clamp(128px,20.8svh,169px)] left-1/2 h-16 w-[295px] -translate-x-1/2 text-center text-[24px] leading-8 font-bold tracking-[0] whitespace-pre-line">
          많이 누를수록{'\n'}높은 점수를 얻을 수 있어요
        </h2>

        <img
          src={pinataCardImage}
          alt=""
          className="absolute top-[clamp(232px,32.9svh,267px)] left-1/2 size-[clamp(208px,32svh,260px)] -translate-x-1/2 object-contain"
        />
      </div>

      <div className="mt-auto mb-[calc(16.6svh+env(safe-area-inset-bottom))] text-center">
        <p className="text-[32px] leading-none font-bold text-white/65">{countdownSeconds}</p>
        <p className="text-body-2 mt-6 font-medium text-white/65">로딩 중이에요...</p>
      </div>
    </section>
  );
}
