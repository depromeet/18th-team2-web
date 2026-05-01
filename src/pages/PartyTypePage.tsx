import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/Button';
import { T4, B2 } from '@/components/ui/Typography';

type PartyType = 'live' | 'rolling';

function CheckCircle({ checked }: { checked: boolean }) {
  return checked ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#5892ff" />
      <path
        d="M7 12.5L10.5 16L17 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11.25" className="fill-white" stroke="#a0a1a5" strokeWidth="1.5" />
      <path
        d="M7 12.5L10.5 16L17 9"
        stroke="#a0a1a5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface PartyTypeCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function PartyTypeCard({ label, selected, onClick }: PartyTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width: 162, height: 257 }}
      className={`flex flex-col justify-between rounded-[12px] p-4 transition-colors ${
        selected
          ? 'border border-blue-500 bg-blue-30'
          : 'border border-transparent bg-grey-30'
      }`}
    >
      <div className="flex justify-end">
        <CheckCircle checked={selected} />
      </div>
      {/* TODO: 에셋 준비되면 이미지 컴포넌트로 교체 */}
      <div style={{ width: 130, height: 110 }} className="mx-auto rounded-md bg-white" />
      <B2
        as="span"
        className={`whitespace-pre-line text-left font-medium ${
          selected ? 'text-blue-500' : 'text-grey-300'
        }`}
      >
        {label}
      </B2>
    </button>
  );
}

export default function PartyTypePage() {
  const [selected, setSelected] = useState<PartyType | null>(null);
  const navigate = useNavigate();

  const toggle = (type: PartyType) => {
    setSelected((prev) => (prev === type ? null : type));
  };

  const handleComplete = () => {
    if (!selected) return;
    // TODO: 다음 단계 경로로 교체
    navigate('/');
  };

  return (
    <MobileLayout>
      <div className="flex min-h-screen flex-col">
        {/* 컨테이너: top 140px, width 375px, gap 40px */}
        <div className="mx-auto w-full max-w-[375px] flex flex-col gap-10 pt-[140px]">
          <T4 className="px-5">어떤 파티를 열어볼까요?</T4>
          <div className="flex justify-center gap-3">
            <PartyTypeCard
              label={'라이브 파티와\n롤링페이퍼 받기'}
              selected={selected === 'live'}
              onClick={() => toggle('live')}
            />
            <PartyTypeCard
              label="롤링페이퍼만 받기"
              selected={selected === 'rolling'}
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
    </MobileLayout>
  );
}
