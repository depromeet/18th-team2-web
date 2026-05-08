import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import hapalinPartyCard from '@/assets/images/hapalin-party-card.png';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { H1 } from '@/components/ui/Typography';

const INTRO_DURATION_MS = 4500;

interface CreateIntroScreenProps {
  title: string;
  nextRoute: string;
  showSkipButton?: boolean;
}

export function CreateIntroScreen({
  title,
  nextRoute,
  showSkipButton = false,
}: CreateIntroScreenProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(nextRoute, { replace: true });
    }, INTRO_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [navigate, nextRoute]);

  return (
    <div className="party-intro-screen relative flex w-full flex-1 flex-col items-center self-stretch overflow-hidden pt-[20vh]">
      {showSkipButton && (
        <button
          type="button"
          onClick={() => navigate(nextRoute, { replace: true })}
          aria-label="인트로 화면 건너뛰기"
          className="text-grey-900 absolute top-[9px] right-4 z-20 flex h-6 w-6 items-center justify-center"
        >
          <CloseIcon />
        </button>
      )}
      <H1 className="party-intro-text relative z-10 text-center tracking-[-0.02em] text-white">
        {title}
      </H1>
      <div className="relative z-10 mt-[4vh] w-full">
        <img
          src={hapalinPartyCard}
          alt="파티 케이크"
          className="party-intro-card w-full select-none"
          draggable={false}
        />
      </div>
      <div className="party-intro-overlay pointer-events-none absolute right-0 bottom-0 left-0 h-[50%]" />
    </div>
  );
}
