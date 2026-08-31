import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import defaultInvitationCharacter from '@/assets/images/character/character-blue-full.png';
import shareIcon from '@/assets/icons/icon-share.svg';
import trashIcon from '@/assets/icons/icon-fill-trash.svg';
import { HostActions } from '@/components/party-invitation/HostActions';
import { InvitationCard } from '@/components/party-invitation/InvitationCard';
import { HostTitle, ParticipantTitle } from '@/components/party-invitation/InvitationTitle';
import { ParticipantActions } from '@/components/party-invitation/ParticipantActions';
import { PartyDeleteDialog } from '@/components/party-invitation/PartyDeleteDialog';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { ROUTES } from '@/constants/routes';
import { usePartyCountdown } from '@/hooks/usePartyCountdown';
import { useDeleteParty } from '@/services/party';
import { useJoinPartyInvite } from '@/services/party-invite';
import { useAuthStore } from '@/stores/useAuthStore';
import { buildRollingPaperWritePath } from '@/utils/rollingPaperWrite';

const activeInvitationButtonClassName =
  'bg-[linear-gradient(111deg,#5892FC_20.81%,#3444F3_70.81%)] shadow-[5px_5px_14px_#8FB6FF]';

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
  const canDelete = isHost && startsAt.getTime() > Date.now();

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

  const invitationActions =
    isHost && partyOption === 'PAPER_ONLY' ? (
      <div className="flex w-full flex-col gap-2">
        <Button
          className={activeInvitationButtonClassName}
          variant="primary"
          size="full"
          onClick={handleViewRollingPaper}
        >
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
      <HostActions isWithin5Minutes={isWithin5Minutes} onEnterParty={handleEnterParty} />
    ) : (
      <ParticipantActions
        isWithin5Minutes={isWithin5Minutes}
        hasWrittenRollingPaper={hasWrittenRollingPaper}
        canEnterParty={partyOption === 'REALTIME'}
        isJoining={isJoining}
        onEnterParty={handleEnterParty}
        onWriteRollingPaper={handleWriteRollingPaper}
      />
    );

  return (
    <>
      <main className="bg-gradient-bg flex min-h-dvh flex-col overflow-x-hidden">
        <header className="mx-auto flex h-18 w-full max-w-150 items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            aria-label="뒤로가기"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            onClick={() => navigate(-1)}
          >
            <ChevronLeftIcon className="h-6 w-6 text-grey-900" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(0,0,0,0.7)] py-2 pr-3 pl-2.5 text-label-1 font-medium text-white backdrop-blur-[2px] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              onClick={() => setIsShareSheetOpen(true)}
            >
              <img src={shareIcon} alt="" aria-hidden="true" className="h-5 w-5" />
              공유하기
            </button>
            {canDelete && (
              <button
                type="button"
                aria-label="파티 삭제하기"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <img src={trashIcon} alt="" className="h-5 w-5" />
              </button>
            )}
          </div>
        </header>

        <section
          className="mx-auto flex w-full max-w-150 flex-1 flex-col items-center gap-4 px-4 pt-[clamp(18px,4svh,42px)] pb-[calc(24px+env(safe-area-inset-bottom))] [@media_(max-height:740px)]:gap-3 [@media_(max-height:740px)]:pt-2"
        >
          {isHost ? <HostTitle hostName={hostName} /> : <ParticipantTitle hostName={hostName} />}
          <img
            src={defaultInvitationCharacter}
            alt=""
            aria-hidden="true"
            className="h-[120px] w-[120px] object-contain [@media_(max-height:740px)]:h-[96px] [@media_(max-height:740px)]:w-[96px]"
          />
          <InvitationCard
            hostName={hostName}
            startsAt={startsAt}
            partyOption={partyOption}
            isHost={isHost}
            isWithin5Minutes={isWithin5Minutes}
            hasWrittenRollingPaper={hasWrittenRollingPaper}
            onWriteRollingPaper={handleWriteRollingPaper}
            onViewRollingPaper={handleViewRollingPaper}
          />
          <div className="mt-4 flex w-full max-w-[375px] flex-col items-center justify-end bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_40.91%)] pt-2 pb-[env(safe-area-inset-bottom)]">
            <div className="w-full max-w-[343px]">{invitationActions}</div>
          </div>
        </section>

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
