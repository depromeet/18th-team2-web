import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { HostActions } from '@/components/party-invitation/HostActions';
import { HostTitle, ParticipantTitle } from '@/components/party-invitation/InvitationTitle';
import { InvitationCard } from '@/components/party-invitation/InvitationCard';
import { ParticipantActions } from '@/components/party-invitation/ParticipantActions';
import { PartyDeleteDialog } from '@/components/party-invitation/PartyDeleteDialog';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { ROUTES } from '@/constants/routes';
import { usePartyCountdown } from '@/hooks/usePartyCountdown';
import { useDeleteParty } from '@/services/party';
import { useJoinPartyInvite } from '@/services/party-invite';

interface PartyInvitationViewProps {
  partyId: string;
  inviteToken: string;
  hostName: string;
  startsAt: Date;
  enterableFrom?: Date;
  isHost: boolean;
  rollingPaperWritten: boolean;
  partyOption: 'REALTIME' | 'PAPER_ONLY';
}

export function PartyInvitationView({
  partyId,
  inviteToken,
  hostName,
  startsAt,
  enterableFrom,
  isHost,
  rollingPaperWritten,
  partyOption,
}: PartyInvitationViewProps) {
  const navigate = useNavigate();
  const { isWithin5Minutes } = usePartyCountdown(enterableFrom ?? startsAt);

  const [hasWrittenRollingPaper, setHasWrittenRollingPaper] = useState(rollingPaperWritten);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteParty, isPending: isDeletingParty } = useDeleteParty();
  const { mutate: joinPartyInvite, isPending: isJoining } = useJoinPartyInvite();
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const inviteLink = `${window.location.origin}${window.location.pathname}`;

  function handleEnterParty() {
    if (isHost) {
      navigate(generatePath(ROUTES.partyEnter, { partyId }));
      return;
    }
    joinPartyInvite(inviteToken, {
      onSuccess: () => navigate(generatePath(ROUTES.partyEnter, { partyId })),
    });
  }

  function handleWriteRollingPaper() {
    setHasWrittenRollingPaper(true);
    navigate(generatePath(ROUTES.rollingPaperWrite, { partyId }), {
      state: {
        completeCta: 'invite',
        invitePath: window.location.pathname,
        inviteToken,
        hostName,
      },
    });
  }

  function handleDeleteParty() {
    if (startsAt.getTime() <= Date.now()) return;

    deleteParty(partyId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        navigate(ROUTES.home, { replace: true });
      },
    });
  }

  return (
    <>
      <main className="bg-gradient-bg flex min-h-screen flex-col">
        <section className="flex flex-1 flex-col items-center gap-7 px-4 pt-16">
          {isHost ? <HostTitle /> : <ParticipantTitle hostName={hostName} />}
          <InvitationCard
            hostName={hostName}
            startsAt={startsAt}
            isHost={isHost}
            onDeleteClick={() => setIsDeleteDialogOpen(true)}
          />
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
                canEnterParty={partyOption === 'REALTIME'}
                isJoining={isJoining}
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

      <PartyDeleteDialog
        isOpen={isDeleteDialogOpen}
        isPending={isDeletingParty}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteParty}
      />
    </>
  );
}
