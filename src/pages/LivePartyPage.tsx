import { useEffect, useState } from 'react';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';

import { ChatBottomSheet } from '@/components/live-party/chat/ChatBottomSheet';
import { AutoEndedBottomSheet } from '@/components/live-party/host-waiting/AutoEndedBottomSheet';
import { HostWaitingView } from '@/components/live-party/host-waiting/HostWaitingView';
import { StepRenderer } from '@/components/live-party/StepRenderer';
import { PartyExitDialog } from '@/components/live-party/PartyExitDialog';
import { LivePartyHeader } from '@/components/live-party/LivePartyHeader';
import { PartyEndingNotice } from '@/components/live-party/ending/PartyEndingNotice';
import { config } from '@/config/env';
import { usePartyExitDialog } from '@/hooks/live-party/usePartyExitDialog';
import { useHostLivePartyGate } from '@/hooks/live-party/useHostLivePartyGate';
import { useLivePartyStep } from '@/hooks/live-party/usePartyStep';
import { usePartyMusic } from '@/hooks/live-party/usePartyMusic';
import { useLivePartySSE } from '@/hooks/live-party/useLivePartySSE';
import { PartyMainBackground } from '@/components/live-party/main-background/PartyMainBackground';
import { LIVE_PARTY_STEP, PARTY_USER } from '@/constants/live-party';
import { ROUTES } from '@/constants/routes';
import { TransitionEffect } from '@/components/live-party/TransitionEffect';
import { PartyFirecrackerEffect } from '@/components/live-party/chat/PartyFirecrackerEffect';
import { useGetMyRealtimeProfile } from '@/services/party-enter';
import { useDeleteParty } from '@/services/party';

function resolveImageUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${config.apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export default function LivePartyPage() {
  const { partyId = '' } = useParams<{ partyId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { inviteToken?: string; hostName?: string } | null;
  const inviteToken = locationState?.inviteToken ?? '';
  const entryStorageKey = partyId ? `live-party-entry-shown:${partyId}` : '';
  const hasStoredEntryShown = entryStorageKey
    ? sessionStorage.getItem(entryStorageKey) === 'true'
    : false;

  const { isExitDialogOpen, handleOpenExitDialog, handleCancelExit, handleConfirmExit } =
    usePartyExitDialog();
  const { data: profile, isLoading: isProfileLoading } = useGetMyRealtimeProfile(inviteToken);
  const isHost = profile?.isHost ?? false;
  const { mutate: deleteParty, isPending: isDeletingParty } = useDeleteParty();
  const hostGate = useHostLivePartyGate(partyId, isHost);

  const { step, userRole, partyEnd, handleNextStep, isTransitioning } = useLivePartyStep({
    initialStep: hasStoredEntryShown ? LIVE_PARTY_STEP.MUSIC : LIVE_PARTY_STEP.ENTRY,
    initialUserRole: isHost ? PARTY_USER.HOST : PARTY_USER.PARTICIPANT_NOT_WRITTEN,
    onEntryComplete: () => {
      if (entryStorageKey) sessionStorage.setItem(entryStorageKey, 'true');
    },
  });

  const { musicIsMuted, handleToggleMute } = usePartyMusic({ step });
  const hostName =
    hostGate.celebrant?.nickname ??
    locationState?.hostName ??
    (isHost ? profile?.nickname : undefined);
  const hostCharacterImage =
    resolveImageUrl(hostGate.celebrant?.characterImageUrl) ??
    (isHost ? resolveImageUrl(profile?.character?.characterImageUrl) : null);

  function handleInvite() {
    if (!inviteToken) return;
    navigate(generatePath(ROUTES.partyInvite, { inviteToken }));
  }

  function handleDeleteParty() {
    if (!partyId) return;
    deleteParty(partyId, {
      onSuccess: () => navigate(ROUTES.home, { replace: true }),
    });
  }

  const { messages, addMessage, candleBlowState, burstGameState, partyEndingState } =
    useLivePartySSE();
  const isPinataStep = step === LIVE_PARTY_STEP.PINATA;
  const isPartyEnding = Boolean(partyEndingState && !partyEndingState.ended);
  const [isPinataOverlayDismissed, setIsPinataOverlayDismissed] = useState(false);

  useEffect(() => {
    if (!isPinataStep) {
      setIsPinataOverlayDismissed(false);
    }
  }, [isPinataStep]);

  const showPinataOverlay = isPinataStep && !isPinataOverlayDismissed;
  const isPinataOverlayActive = showPinataOverlay && !isPartyEnding;

  const showPartyMain =
    isPartyEnding ||
    (step !== LIVE_PARTY_STEP.ENTRY &&
      step !== LIVE_PARTY_STEP.END &&
      step !== LIVE_PARTY_STEP.CANDLE);

  if (inviteToken && isProfileLoading) {
    return <div className="bg-blue-1000 h-svh w-full" />;
  }

  if (hostGate.isEnded) {
    return (
      <AutoEndedBottomSheet
        onCreateParty={() => navigate(ROUTES.createParty)}
        onHome={() => navigate(ROUTES.home, { replace: true })}
        onClose={() => navigate(ROUTES.home, { replace: true })}
      />
    );
  }

  if (hostGate.shouldGateHost) {
    return (
      <>
        <HostWaitingView
          celebrant={hostGate.celebrant}
          remainingSeconds={hostGate.remainingSeconds}
          isEnding={hostGate.isEnding}
          isDeleting={isDeletingParty}
          onInvite={handleInvite}
          onDelete={handleDeleteParty}
          onClose={handleOpenExitDialog}
        />
        <PartyExitDialog
          isOpen={isExitDialogOpen}
          isHost={isHost}
          onCancel={handleCancelExit}
          onConfirm={handleConfirmExit}
        />
      </>
    );
  }

  return (
    <div
      className={`relative h-svh w-full max-w-[600px] bg-cover bg-center bg-no-repeat ${partyEnd ? 'backdrop-blur-lg' : 'bg-blue-1000'} `}
    >
      {showPartyMain && <PartyFirecrackerEffect />}
      {!partyEnd && (
        <LivePartyHeader
          onNextStep={handleNextStep}
          onExitClick={handleOpenExitDialog}
          musicIsMuted={musicIsMuted}
          handleToggleMute={handleToggleMute}
          step={step}
        />
      )}
      {showPartyMain && <PartyMainBackground isBlurred={isPinataOverlayActive} />}
      {!isPartyEnding && (
        <StepRenderer
          step={step}
          onStepComplete={handleNextStep}
          showPinataOverlay={showPinataOverlay}
          onReturnToPartyRoom={() => setIsPinataOverlayDismissed(true)}
          userRole={userRole}
          hostName={hostName}
          hostCharacterImage={hostCharacterImage}
          candleBlowState={candleBlowState}
          burstGameState={burstGameState}
        />
      )}
      {isPartyEnding && partyEndingState && (
        <PartyEndingNotice partyEndingState={partyEndingState} />
      )}
      <TransitionEffect isTransitioning={isTransitioning} />
      {showPartyMain && (
        <ChatBottomSheet
          messages={messages}
          onSend={addMessage}
          isBlurred={isPinataOverlayActive}
        />
      )}
      <PartyExitDialog
        isOpen={isExitDialogOpen}
        isHost={userRole === PARTY_USER.HOST}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
