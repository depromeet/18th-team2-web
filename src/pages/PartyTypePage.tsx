import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { T4, B1 } from '@/components/ui/Typography';
import { LoginPromptSheet } from '@/components/ui/LoginPromptSheet';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';

type PartyType = 'live' | 'rolling';
type CardState = 'default' | 'selected' | 'inactive';

function CheckCircle({ state }: { state: CardState }) {
  if (state === 'selected') {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#5892ff" />
        <path
          d="M9.5 16.5L14 21L22.5 12"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  const checkColor = state === 'inactive' ? '#bebebf' : '#6b6c70';

  return (
    <div className="relative shrink-0" style={{ width: 32, height: 32 }}>
      <div
        className="absolute rounded-full bg-white"
        style={{ width: 26.67, height: 26.67, top: 2.67, left: 2.67 }}
      />
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="absolute inset-0">
        <path
          d="M9.5 16.5L14 21L22.5 12"
          stroke={checkColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

interface PartyTypeCardProps {
  label: string;
  state: CardState;
  onClick: () => void;
}

function PartyTypeCard({ label, state, onClick }: PartyTypeCardProps) {
  const cardStyle = {
    default: 'border border-transparent bg-grey-30',
    selected: 'border border-blue-500 bg-blue-30',
    inactive: 'border border-transparent bg-grey-30',
  }[state];

  const textStyle = {
    default: 'text-grey-900 font-medium',
    selected: 'text-blue-600 font-bold',
    inactive: 'text-grey-300 font-medium',
  }[state];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width: 162, height: 257 }}
      className={`rounded-btn-md relative transition-colors ${cardStyle}`}
    >
      <div className="absolute top-4 right-4">
        <CheckCircle state={state} />
      </div>
      {/* TODO: 에셋 준비되면 이미지 컴포넌트로 교체 */}
      <div className="absolute" style={{ top: 68, left: 16 }}>
        <div style={{ width: 130, height: 110 }} className="rounded-md bg-white" />
      </div>
      <div className="absolute right-4 bottom-4 left-4 text-left">
        <B1 className={`whitespace-pre-line ${textStyle}`}>{label}</B1>
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
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const toggle = (type: PartyType) => {
    setSelected((prev) => (prev === type ? null : type));
  };

  const handleComplete = () => {
    if (!selected) return;
    if (!isAuthenticated) {
      setShowLoginSheet(true);
      return;
    }
    navigate(ROUTES.createPartyIntro);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-93.75 flex-col gap-10 pt-35">
          <T4 className="px-5">어떤 파티를 열어볼까요?</T4>
          <div className="flex justify-center gap-3">
            <PartyTypeCard
              label={'라이브 파티와\n롤링페이퍼 받기'}
              state={getCardState('live', selected)}
              onClick={() => toggle('live')}
            />
            <PartyTypeCard
              label="롤링페이퍼만 받기"
              state={getCardState('rolling', selected)}
              onClick={() => toggle('rolling')}
            />
          </div>
        </div>
        <div className="mt-auto px-5 pb-6">
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
      <LoginPromptSheet isOpen={showLoginSheet} onClose={() => setShowLoginSheet(false)} />
    </>
  );
}
