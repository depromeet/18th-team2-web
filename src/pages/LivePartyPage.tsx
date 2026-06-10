import { useEffect, useRef, useState } from 'react';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';

import { ChatBottomSheet } from '@/components/live-party/chat/ChatBottomSheet';
import { AutoEndedBottomSheet } from '@/components/live-party/host-waiting/AutoEndedBottomSheet';
import { HostWaitingView } from '@/components/live-party/host-waiting/HostWaitingView';
import { Button } from '@/components/ui/Button';
import { StepRenderer } from '@/components/live-party/StepRenderer';
import { PartyExitDialog } from '@/components/live-party/PartyExitDialog';
import { LivePartyHeader } from '@/components/live-party/LivePartyHeader';
import { PartyEndingNotice } from '@/components/live-party/ending/PartyEndingNotice';
import { usePartyExitDialog } from '@/hooks/live-party/usePartyExitDialog';
import { useHostLivePartyGate } from '@/hooks/live-party/useHostLivePartyGate';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLivePartyStep } from '@/hooks/live-party/usePartyStep';
import { usePartyMusic } from '@/hooks/live-party/usePartyMusic';
import { useLivePartySSE } from '@/hooks/live-party/useLivePartySSE';
import { PartyMainBackground } from '@/components/live-party/main-background/PartyMainBackground';
import { LIVE_PARTY_STEP, PARTICIPANT_TOKEN_KEY, PARTY_USER } from '@/constants/live-party';
import { ROUTES } from '@/constants/routes';
import { TransitionEffect } from '@/components/live-party/TransitionEffect';
import { PartyFirecrackerEffect } from '@/components/live-party/chat/PartyFirecrackerEffect';
import { useGetMyRealtimeProfile } from '@/services/party-enter';
import { useDeleteParty } from '@/services/party';
import { useRealtimePartyNextAction, useStartRealtimeEnd } from '@/services/live-party';
import { Loading } from '@/components/ui/Loading';

export default function LivePartyPage() {
  const { partyId = '' } = useParams<{ partyId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { inviteToken?: string; hostName?: string } | null;
  const inviteToken = locationState?.inviteToken ?? '';
  const participantToken = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
  const hasNavigatedAfterPartyEndRef = useRef(false);

  const {
    messages,
    addMessage,
    candleBlowState,
    burstGameState,
    partyEndingState,
    currentPhase,
    hasParticipantToken,
  } = useLivePartySSE();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const canFetch = isAuthenticated || hasParticipantToken;

  const { isExitDialogOpen, handleOpenExitDialog, handleCancelExit, handleConfirmExit } =
    usePartyExitDialog();
  const { data: profile, isLoading: isProfileLoading } = useGetMyRealtimeProfile(
    inviteToken,
    isAuthenticated,
  );
  const isHost = profile?.isHost ?? false;
  const { mutate: deleteParty, isPending: isDeletingParty } = useDeleteParty();
  const { mutate: startRealtimeEnd, isPending: isStartingPartyEnding } = useStartRealtimeEnd();
  const hostGate = useHostLivePartyGate(partyId, isHost, canFetch);

  const isPartyEnded = Boolean(partyEndingState?.ended);

  const {
    step,
    partyEnd,
    handleNextStep,
    handleEntryComplete,
    isEntryReady,
    isTransitioning,
    isInitialized,
    goToEndStep,
  } = useLivePartyStep({
    partyId,
    ssePhase: currentPhase,
    isPartyEnded,
    enabled: canFetch,
  });

  const userRole = isHost ? PARTY_USER.HOST : PARTY_USER.PARTICIPANT_NOT_WRITTEN;
  const { musicIsMuted, handleToggleMute } = usePartyMusic({ step });
  const hostName =
    hostGate.celebrant?.nickname ??
    locationState?.hostName ??
    (isHost ? profile?.nickname : undefined);

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

  function handleStartPartyEnding() {
    if (!partyId || !isHost) return;
    startRealtimeEnd(partyId);
  }

  const isPartyEndingFlow = Boolean(partyEndingState);
  const isPartyEnding = Boolean(partyEndingState && !partyEndingState.ended);
  const { data: nextAction } = useRealtimePartyNextAction(partyId, participantToken, isPartyEnded);
  const [isPinataOverlayDismissed, setIsPinataOverlayDismissed] = useState(false);

  useEffect(() => {
    if (partyEndingState?.ended) {
      goToEndStep();
    }
  }, [goToEndStep, partyEndingState?.ended]);

  useEffect(() => {
    if (!nextAction || hasNavigatedAfterPartyEndRef.current) {
      return;
    }

    hasNavigatedAfterPartyEndRef.current = true;

    if (nextAction.type === 'HOST_ROLLING_PAPER_LIST') {
      navigate(generatePath(ROUTES.rollingPaper, { id: String(nextAction.partyId) }), {
        replace: true,
      });
      return;
    }

    if (nextAction.rollingPaperWritten) {
      navigate(generatePath(ROUTES.rollingPaper, { id: partyId }), {
        replace: true,
        state: { inviteToken: nextAction.inviteToken },
      });
      return;
    }

    navigate(generatePath(ROUTES.rollingPaperWrite, { partyId }), {
      replace: true,
      state: {
        completeCta: 'home',
        inviteToken: nextAction.inviteToken,
        hostName,
      },
    });
  }, [hostName, navigate, nextAction, partyId]);

  useEffect(() => {
    if (!step || step !== LIVE_PARTY_STEP.PINATA) {
      setIsPinataOverlayDismissed(false);
    }
  }, [step]);

  const isPinataStep = step === LIVE_PARTY_STEP.PINATA;
  const isEntryStep = step === LIVE_PARTY_STEP.ENTRY;
  const showPinataOverlay = isPinataStep && !isPinataOverlayDismissed;
  const isPinataOverlayActive = showPinataOverlay && !isPartyEnding;
  const showHostEndingButton =
    isHost && isPinataStep && isPinataOverlayDismissed && !isPartyEndingFlow && !partyEnd;

  const shouldShowByStep =
    step !== LIVE_PARTY_STEP.ENTRY &&
    step !== LIVE_PARTY_STEP.END &&
    step !== LIVE_PARTY_STEP.CANDLE;

  const showPartyMain =
    isPartyEnding || (isEntryReady && step === LIVE_PARTY_STEP.ENTRY) || shouldShowByStep;
  const showStartPartyButton = isEntryReady && isHost && isEntryStep && !isPartyEndingFlow;

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
      {(!canFetch || !isInitialized) && <Loading />}
      {showPartyMain && <PartyFirecrackerEffect />}
      {!partyEnd && (
        <LivePartyHeader
          onExitClick={handleOpenExitDialog}
          musicIsMuted={musicIsMuted}
          handleToggleMute={handleToggleMute}
          step={step}
        />
      )}
      {showPartyMain && <PartyMainBackground isBlurred={isPinataOverlayActive} />}
      {!isPartyEndingFlow && !(isEntryStep && isEntryReady) && (
        <StepRenderer
          step={step}
          onStepComplete={isEntryStep ? handleEntryComplete : handleNextStep}
          showPinataOverlay={showPinataOverlay}
          onReturnToPartyRoom={() => setIsPinataOverlayDismissed(true)}
          isHost={isHost}
          userRole={userRole}
          candleBlowState={candleBlowState}
          burstGameState={burstGameState}
        />
      )}
      {showStartPartyButton && (
        <div className="absolute right-0 bottom-[336px] left-0 z-40 mx-auto flex w-full max-w-[600px] justify-center px-4">
          <Button type="button" size="md" className="w-auto" onClick={handleNextStep}>
            파티 시작하기
          </Button>
        </div>
      )}
      {showHostEndingButton && (
        <div className="absolute right-0 bottom-[336px] left-0 z-40 mx-auto flex w-full max-w-[600px] justify-center px-4">
          <Button
            type="button"
            size="md"
            className="w-auto"
            onClick={handleStartPartyEnding}
            disabled={isStartingPartyEnding}
          >
            파티 종료 인사하기
          </Button>
        </div>
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
        isHost={isHost}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
