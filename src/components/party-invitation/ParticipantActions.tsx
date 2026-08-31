import { Button } from '@/components/ui/Button';

import { PartyEntranceHint } from './PartyHintText';

const activeInvitationButtonClassName =
  'bg-[linear-gradient(111deg,#5892FC_20.81%,#3444F3_70.81%)] shadow-[5px_5px_14px_#8FB6FF]';

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
  if (!canEnterParty) {
    return (
      <div className="flex w-full flex-col gap-2">
        <Button
          className={!hasWrittenRollingPaper ? activeInvitationButtonClassName : undefined}
          variant={hasWrittenRollingPaper ? 'secondary' : 'primary'}
          size="full"
          disabled={hasWrittenRollingPaper}
          onClick={onWriteRollingPaper}
        >
          {hasWrittenRollingPaper ? '롤링페이퍼 작성 완료' : '롤링페이퍼 남기러 가기'}
        </Button>
      </div>
    );
  }

  if (isWithin5Minutes && canEnterParty) {
    return (
      <div className="flex w-full flex-col gap-2">
        <Button
          className={activeInvitationButtonClassName}
          variant="primary"
          size="full"
          disabled={isJoining}
          onClick={onEnterParty}
        >
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
      <Button variant="secondary" size="full" disabled onClick={onWriteRollingPaper}>
        생일파티 참가하기
      </Button>
    </div>
  );
}
