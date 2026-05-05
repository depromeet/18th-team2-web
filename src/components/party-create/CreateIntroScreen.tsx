import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import hapalinPartyCard from '@/assets/images/hapalin-party-card.png';
import { H1 } from '@/components/ui/Typography';

const INTRO_DURATION_MS = 4500;

interface CreateIntroScreenProps {
  title: string;
  nextRoute: string;
}

export function CreateIntroScreen({ title, nextRoute }: CreateIntroScreenProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(nextRoute, { replace: true });
    }, INTRO_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [navigate, nextRoute]);

  return (
    <div className="party-intro-screen relative flex w-full flex-1 flex-col items-center self-stretch overflow-hidden pt-[20vh]">
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
