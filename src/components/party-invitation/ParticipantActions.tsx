import { Button } from '@/components/ui/Button';
import { L1 } from '@/components/ui/Typography';

interface ParticipantActionsProps {
  isWithin5Minutes: boolean;
  onEnterParty: () => void;
  onWriteRollingPaper: () => void;
}

export function ParticipantActions({
  isWithin5Minutes,
  onEnterParty,
  onWriteRollingPaper,
}: ParticipantActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      {!isWithin5Minutes && (
        <L1 as="p" className="text-center text-grey-500">
          파티는 시작 5분 전부터 입장 가능해요
        </L1>
      )}
      {isWithin5Minutes && (
        <Button variant="primary" size="full" onClick={onEnterParty}>
          파티 입장하기
        </Button>
      )}
      <Button variant="white-blue" size="full" onClick={onWriteRollingPaper}>
        롤링페이퍼 미리 남기기
      </Button>
    </div>
  );
}
