import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CheckCircleFilledGreySvg from '@/assets/images/icons/check-circle-filled-grey.svg?react';
import livePartyImg from '@/assets/images/create-party/live-party.svg';
import livePartyInactiveImg from '@/assets/images/create-party/live-party-inactive.svg';
import rollingPaperImg from '@/assets/images/create-party/rolling-paper.svg';
import rollingPaperInactiveImg from '@/assets/images/create-party/rolling-paper-inactive.svg';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { T4, B1, L1 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import { CheckCircleFilledIcon } from '@/components/ui/icons/CheckCircleFilledIcon';

type PartyType = 'live' | 'rolling';
type CardState = 'default' | 'selected' | 'inactive';

function CheckCircle({ state }: { state: CardState }) {
  if (state === 'selected') {
    return <CheckCircleFilledIcon />;
  }

  return <CheckCircleFilledGreySvg />;
}

interface PartyTypeCardProps {
  label: string;
  description: string;
  compactDescription?: string;
  state: CardState;
  activeImage: string;
  inactiveImage: string;
  onClick: () => void;
}

function PartyTypeCard({
  label,
  description,
  compactDescription,
  state,
  activeImage,
  inactiveImage,
  onClick,
}: PartyTypeCardProps) {
  const cardStyle = {
    default: 'border border-transparent bg-grey-30',
    selected: 'border border-blue-500 bg-blue-30',
    inactive: 'border border-transparent bg-grey-30',
  }[state];

  const textStyle = {
    default: 'text-black font-semibold',
    selected: 'text-black font-bold',
    inactive: 'text-grey-600 font-semibold',
  }[state];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-btn-md flex h-[clamp(236px,41svh,274px)] w-[min(166px,calc((100vw-48px)/2))] flex-col gap-[clamp(12px,2.4svh,20px)] px-3 py-[clamp(12px,2.4svh,16px)] transition-colors ${cardStyle}`}
    >
      <div className="flex justify-end">
        <CheckCircle state={state} />
      </div>
      <img
        src={state === 'inactive' ? inactiveImage : activeImage}
        alt=""
        aria-hidden
        className="h-[clamp(88px,16svh,110px)] w-full object-contain"
      />
      <div className="mt-auto flex flex-col gap-[6px] text-left">
        <B1 className={`whitespace-pre-line ${textStyle}`}>{label}</B1>
        <L1 as="p" className="text-grey-500 leading-snug font-medium whitespace-pre-line">
          <span className={compactDescription ? '[@media_(max-width:375px)]:hidden' : undefined}>
            {description}
          </span>
          {compactDescription && (
            <span className="hidden [@media_(max-width:375px)]:inline">{compactDescription}</span>
          )}
        </L1>
      </div>
    </button>
  );
}

function getCardState(type: PartyType, selected: PartyType | null): CardState {
  if (selected === type) return 'selected';
  if (selected !== null) return 'inactive';
  return 'default';
}

export default function PartyTypePage() {
  const [selected, setSelected] = useState<PartyType | null>(null);
  const navigate = useNavigate();

  const toggle = (type: PartyType) => {
    setSelected((prev) => (prev === type ? null : type));
  };

  const handleComplete = () => {
    if (!selected) return;
    navigate(selected === 'rolling' ? ROUTES.createRollingPaperIntro : ROUTES.createPartyIntro);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader />
      <div className="mx-auto flex w-full max-w-93.75 flex-col gap-[clamp(24px,5svh,40px)] pt-[clamp(48px,14svh,140px)]">
        <T4 className="px-5">어떤 파티를 열어볼까요?</T4>
        <div className="flex justify-center gap-2">
          <PartyTypeCard
            label="라이브 파티 열기"
            description={`함께 짧게 축하하고, \n 롤링 페이퍼도 받아보세요`}
            compactDescription={`함께 짧게 축하하고,\n롤링 페이퍼도\n받아보세요`}
            state={getCardState('live', selected)}
            activeImage={livePartyImg}
            inactiveImage={livePartyInactiveImg}
            onClick={() => toggle('live')}
          />
          <PartyTypeCard
            label="롤링페이퍼만 받기"
            description={`파티 없이 편지만 \n 받을 수 있어요`}
            state={getCardState('rolling', selected)}
            activeImage={rollingPaperImg}
            inactiveImage={rollingPaperInactiveImg}
            onClick={() => toggle('rolling')}
          />
        </div>
      </div>
      <div className="mt-auto px-5 pb-[calc(24px+env(safe-area-inset-bottom))] [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:mt-10 [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:pb-10">
        <Button
          variant={selected ? 'primary' : 'secondary'}
          size="full"
          disabled={!selected}
          onClick={handleComplete}
        >
          선택 완료
        </Button>
      </div>
    </div>
  );
}
