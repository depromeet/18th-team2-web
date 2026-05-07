import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { HostActions } from '@/components/party-invitation/HostActions';
import { HostTitle, ParticipantTitle } from '@/components/party-invitation/InvitationTitle';
import { InvitationCard } from '@/components/party-invitation/InvitationCard';
import { ParticipantActions } from '@/components/party-invitation/ParticipantActions';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { ROUTES } from '@/constants/routes';
import { usePartyCountdown } from '@/hooks/usePartyCountdown';

interface PartyInvitationViewProps {
  partyId: string;
  hostName: string;
  startsAt: Date;
  isHost: boolean;
  rollingPaperWritten: boolean;
}

export function PartyInvitationView({
  partyId,
  hostName,
  startsAt,
  isHost,
  rollingPaperWritten,
}: PartyInvitationViewProps) {
  const navigate = useNavigate();
  const { isWithin5Minutes } = usePartyCountdown(startsAt);

  const [hasWrittenRollingPaper, setHasWrittenRollingPaper] = useState(rollingPaperWritten);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const inviteLink = `${window.location.origin}${window.location.pathname}`;

  function handleEnterParty() {
    navigate(generatePath(ROUTES.partyEnter, { partyId }));
  }

  function handleWriteRollingPaper() {
    setHasWrittenRollingPaper(true);
    navigate(generatePath(ROUTES.rollingPaperWrite, { partyId }));
  }

  return (
    <main className="bg-gradient-bg flex min-h-screen flex-col">
      <section className="flex flex-1 flex-col items-center gap-7 px-4 pt-16">
        {isHost ? <HostTitle /> : <ParticipantTitle hostName={hostName} />}
        <InvitationCard hostName={hostName} startsAt={startsAt} isHost={isHost} />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto flex min-h-27.5 w-full max-w-150 items-end bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_40.91%)] px-4 pt-2 pb-6">
        <div className="w-full">
          {isHost ? (
            <HostActions
              isWithin5Minutes={isWithin5Minutes}
              onEnterParty={handleEnterParty}
              onShareInvite={() => setIsShareSheetOpen(true)}
            />
          ) : (
            <ParticipantActions
              isWithin5Minutes={isWithin5Minutes}
              hasWrittenRollingPaper={hasWrittenRollingPaper}
              onEnterParty={handleEnterParty}
              onWriteRollingPaper={handleWriteRollingPaper}
            />
          )}
        </div>
      </div>

      <LinkShareSheet
        isOpen={isShareSheetOpen}
        link={inviteLink}
        title="초대장 링크 공유하기"
        shareText="초대장이 도착했어요"
        onClose={() => setIsShareSheetOpen(false)}
      />
    </main>
  );
}
