import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { Button } from '@/components/ui/Button';
import { LIVE_PARTY_STEP, type PartyStep } from '@/constants/live-party';
import { useState } from 'react';
import { MusicPlayIcon } from '@/components/ui/icons/MusicPlayIcon';
import { MusicMutedIcon } from '@/components/ui/icons/MusicMutedIcon';

//임시? 추후 공통 컴포넌트로 교체 후 삭제될 가능성 있음
interface LivePartyHeaderProps {
  onNextStep: () => void;
  onExitClick: () => void;
  step: PartyStep;
}

export function LivePartyHeader({ onNextStep, onExitClick, step }: LivePartyHeaderProps) {
  const [playMusic, setPlayMusic] = useState(true);

  const handleMusicIcon = () => {
    setPlayMusic((v) => !v);
  };

  return (
    <header className="absolute top-0 right-0 left-0 z-11 flex items-center justify-between p-4">
      {step === LIVE_PARTY_STEP.MUSIC && (
        <button onClick={handleMusicIcon}>
          {playMusic ? <MusicPlayIcon /> : <MusicMutedIcon />}
        </button>
      )}

      {/* 프리런칭 데이를 위한 임시 스텝 버튼 */}
      <Button size="sm" onClick={onNextStep}>
        다음 스텝
      </Button>
      <button onClick={onExitClick} aria-label="파티 나가기">
        <CloseIcon className="text-white" />
      </button>
    </header>
  );
}
