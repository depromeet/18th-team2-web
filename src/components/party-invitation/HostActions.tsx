import { Button } from '@/components/ui/Button';
import { L1 } from '@/components/ui/Typography';

interface HostActionsProps {
  isWithin5Minutes: boolean;
  onEnterParty: () => void;
}

export function HostActions({ isWithin5Minutes, onEnterParty }: HostActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      {!isWithin5Minutes && (
        <L1 as="p" className="text-center text-grey-500">
          파티는 시작 5분 전부터 입장 가능해요
        </L1>
      )}
      <Button
        variant="white-blue"
        size="full"
        disabled={!isWithin5Minutes}
        onClick={onEnterParty}
      >
        생일파티 참가하기
      </Button>
    </div>
  );
}
