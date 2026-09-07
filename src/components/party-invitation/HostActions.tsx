import { Button } from '@/components/ui/Button';

import { PartyEntranceHint } from './PartyHintText';

const activeInvitationButtonClassName = 'bg-invitation-primary shadow-invitation-primary';

interface HostActionsProps {
  isWithin5Minutes: boolean;
  onEnterParty: () => void;
}

export function HostActions({ isWithin5Minutes, onEnterParty }: HostActionsProps) {
  if (isWithin5Minutes) {
    return (
      <Button
        className={activeInvitationButtonClassName}
        variant="primary"
        size="full"
        onClick={onEnterParty}
      >
        생일파티 참가하기
      </Button>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <PartyEntranceHint />
      <Button variant="secondary" size="full" disabled>
        생일파티 참가하기
      </Button>
    </div>
  );
}
