import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { HostActions } from '@/components/party-invitation/HostActions';
import { HostTitle, ParticipantTitle } from '@/components/party-invitation/InvitationTitle';
import { InvitationCard } from '@/components/party-invitation/InvitationCard';
import { ParticipantActions } from '@/components/party-invitation/ParticipantActions';
import { PartyDeleteDialog } from '@/components/party-invitation/PartyDeleteDialog';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { Button } from '@/components/ui/Button';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { PageHeader } from '@/components/ui/PageHeader';
import { ROUTES } from '@/constants/routes';
import { usePartyCountdown } from '@/hooks/usePartyCountdown';
import { useDeleteParty } from '@/services/party';
import { useJoinPartyInvite } from '@/services/party-invite';
import { useAuthStore } from '@/stores/useAuthStore';
import { buildRollingPaperWritePath } from '@/utils/rollingPaperWrite';

interface PartyInvitationViewProps {
  partyId: string;
  inviteToken: string;
  hostName: string;
  startsAt: Date;
  endsAt?: Date;

  isHost: boolean;
  rollingPaperWritten: boolean;
  partyOption: 'REALTIME' | 'PAPER_ONLY';
}

export function PartyInvitationView({
  partyId,
  inviteToken,
  hostName,
  startsAt,
  endsAt,

  isHost,
  rollingPaperWritten,
  partyOption,
}: PartyInvitationViewProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isWithin5Minutes } = usePartyCountdown(startsAt);

  const [hasWrittenRollingPaper, setHasWrittenRollingPaper] = useState(rollingPaperWritten);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteParty, isPending: isDeletingParty } = useDeleteParty();
  const { mutate: joinPartyInvite, isPending: isJoining } = useJoinPartyInvite();
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const inviteLink = `${window.location.origin}${window.location.pathname}`;

  function handleEnterParty() {
    const partyEnterPath = generatePath(ROUTES.partyEnter, { partyId });
    const from = generatePath(ROUTES.partyInvite, { inviteToken });
    if (isHost) {
      navigate(partyEnterPath, { state: { inviteToken, from, hostName } });
      return;
    }
    if (!isAuthenticated) {
      navigate(partyEnterPath, { state: { inviteToken, from, hostName } });
      return;
    }
    joinPartyInvite(inviteToken, {
      onSuccess: () => navigate(partyEnterPath, { state: { inviteToken, from, hostName } }),
    });
  }

  function handleViewRollingPaper() {
    navigate(generatePath(ROUTES.rollingPaper, { id: partyId }));
  }

  function handleWriteRollingPaper() {
    setHasWrittenRollingPaper(true);
    navigate(buildRollingPaperWritePath(partyId, inviteToken), {
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
      <main className="bg-gradient-bg flex min-h-dvh flex-col">
        {isHost && <PageHeader />}
        <section
          className={`flex flex-1 flex-col items-center gap-7 px-4 pb-[calc(164px+env(safe-area-inset-bottom))] [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:flex-none [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:pb-8 [@media_(max-height:700px)]:gap-5 ${isHost ? 'pt-4' : 'pt-[clamp(40px,10svh,64px)]'}`}
        >
          {isHost ? <HostTitle /> : <ParticipantTitle hostName={hostName} />}
          <InvitationCard
            hostName={hostName}
            startsAt={startsAt}
            endsAt={endsAt}
            isHost={isHost}
            partyOption={partyOption}
            onDeleteClick={() => setIsDeleteDialogOpen(true)}
          />
        </section>

        <BottomActionBar
          className="[@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:static [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:z-auto [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:min-h-0 [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:max-w-[343px] [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:bg-none [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:px-4 [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:pt-0 [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:pb-10"
          contentClassName="[@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:max-w-[343px]"
        >
          {isHost && partyOption === 'PAPER_ONLY' ? (
            <div className="flex w-full flex-col gap-2">
              <Button variant="primary" size="full" onClick={handleViewRollingPaper}>
                롤링페이퍼 확인하기
              </Button>
              <button
                type="button"
                className="text-label-1 flex h-9 w-full cursor-pointer items-center justify-center font-semibold text-blue-600 underline underline-offset-2"
                onClick={() => setIsShareSheetOpen(true)}
              >
                초대 링크 공유하기
              </button>
            </div>
          ) : isHost ? (
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
        </BottomActionBar>

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
