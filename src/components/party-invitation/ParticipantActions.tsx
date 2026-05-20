import { Button } from '@/components/ui/Button';

import { PartyEntranceHint, PartyHintText } from './PartyHintText';

interface ParticipantActionsProps {
  isWithin5Minutes: boolean;
  hasWrittenRollingPaper: boolean;
  canEnterParty?: boolean;
  isJoining?: boolean;
  onEnterParty: () => void;
  onWriteRollingPaper: () => void;
}

export function ParticipantActions({
  isWithin5Minutes,
  hasWrittenRollingPaper,
  canEnterParty = true,
  isJoining = false,
  onEnterParty,
  onWriteRollingPaper,
}: ParticipantActionsProps) {
  if (isWithin5Minutes && canEnterParty) {
    const hint = hasWrittenRollingPaper
      ? '롤링페이퍼를 이미 작성했어요'
      : '롤링페이퍼는 파티가 끝나면 작성할 수 있어요';

    return (
      <div className="flex w-full flex-col gap-2">
        <PartyHintText>{hint}</PartyHintText>
        <Button variant="primary" size="full" disabled={isJoining} onClick={onEnterParty}>
          {isJoining ? '참가 중...' : '생일파티 참가하기'}
        </Button>
      </div>
    );
  }

  if (hasWrittenRollingPaper) {
    return (
      <div className="flex w-full flex-col gap-2">
        <PartyEntranceHint />
        <Button variant="secondary" size="full" disabled>
          생일파티 참가하기
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <PartyEntranceHint />
      <Button variant="white-blue" size="full" onClick={onWriteRollingPaper}>
        롤링페이퍼 미리 남기기
      </Button>
    </div>
  );
}
