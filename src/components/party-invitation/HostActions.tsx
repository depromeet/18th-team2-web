import { Button } from '@/components/ui/Button';

import { PartyEntranceHint } from './PartyHintText';

const activeInvitationButtonClassName =
  'bg-[linear-gradient(111deg,#5892FC_20.81%,#3444F3_70.81%)] shadow-[5px_5px_14px_#8FB6FF]';

interface HostActionsProps {
  isWithin5Minutes: boolean;
  onEnterParty: () => void;
  onShareInvite: () => void;
}

function InviteShareButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="text-label-1 flex h-9 w-full cursor-pointer items-center justify-center font-semibold text-blue-600 underline underline-offset-2"
      onClick={onClick}
    >
      초대 링크 공유하기
    </button>
  );
}

export function HostActions({ isWithin5Minutes, onEnterParty, onShareInvite }: HostActionsProps) {
  if (isWithin5Minutes) {
    return (
      <div className="flex w-full flex-col gap-2">
        <Button
          className={activeInvitationButtonClassName}
          variant="primary"
          size="full"
          onClick={onEnterParty}
        >
          생일파티 참가하기
        </Button>
        <InviteShareButton onClick={onShareInvite} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <PartyEntranceHint />
      <Button variant="secondary" size="full" disabled>
        생일파티 참가하기
      </Button>
      <InviteShareButton onClick={onShareInvite} />
    </div>
  );
}
