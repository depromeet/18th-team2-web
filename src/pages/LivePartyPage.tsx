import { useEffect, useMemo, useState } from 'react';
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
import { useRealtimePartyNextAction, useStartRealtimeEnd } from '@/services/live-party';
import { Loading } from '@/components/ui/Loading';
import { ErrorView } from '@/components/ui/ErrorView';
import { B1 } from '@/components/ui/Typography';
import { PartyStartSheet } from '@/components/live-party/PartyStartSheet';

export default function LivePartyPage() {
  const { partyId = '' } = useParams<{ partyId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { inviteToken?: string; hostName?: string; nickname?: string } | null;
  const inviteToken = locationState?.inviteToken ?? '';
  const participantToken = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(PARTICIPANT_TOKEN_KEY);
    };
  }, []);

  const {
    messages,
    addMessage,
    candleBlowState,
    burstGameState,
    partyEndingState,
    currentPhase,
    hasParticipantToken,
    sseError,
    nicknameDuplicate,
  } = useLivePartySSE();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const canFetch = isAuthenticated || hasParticipantToken;

  useEffect(() => {
    if (!nicknameDuplicate) return;
    navigate(generatePath(ROUTES.partyEnter, { partyId }), {
      replace: true,
      state: {
        inviteToken,
        hostName: locationState?.hostName,
        nicknameDuplicateError: true,
        nickname: locationState?.nickname,
      },
    });
  }, [nicknameDuplicate, navigate, partyId, inviteToken, locationState?.hostName, locationState?.nickname]);

  const { isExitDialogOpen, handleOpenExitDialog, handleCancelExit, handleConfirmExit } =
    usePartyExitDialog();
  const { data: profile, isLoading: isProfileLoading } = useGetMyRealtimeProfile(
    inviteToken,
    isAuthenticated,
  );
  const isHost = profile?.isHost ?? false;
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
    isPhaseError,
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

  const [isPartyStartSheetOpen, setIsPartyStartSheetOpen] = useState(false);
  const [isPartyStartSheetVisible, setIsPartyStartSheetVisible] = useState(false);

  const handleInvite = () => {
    if (!inviteToken) return;

    navigate(generatePath(ROUTES.partyInvite, { inviteToken }));
  };

  const handleStartPartyEnding = () => {
    if (!partyId || !isHost) return;

    startRealtimeEnd(partyId);
  };

  const handleErrorRetry = () => {
    window.location.reload();
  };

  const handleErrorBack = () => {
    navigate(-1);
  };

  const handleCreateParty = () => {
    navigate(ROUTES.createParty);
  };

  const handleGoHome = () => {
    navigate(ROUTES.home, { replace: true });
  };

  const handleReturnToPartyRoom = () => {
    setIsPinataOverlayDismissed(true);
  };

  const handleOpenPartyStartSheet = () => {
    setIsPartyStartSheetOpen(true);

    requestAnimationFrame(() => {
      setIsPartyStartSheetVisible(true);
    });
  };

  const handleClosePartyStartSheet = () => {
    setIsPartyStartSheetVisible(false);

    setTimeout(() => {
      setIsPartyStartSheetOpen(false);
    }, 300);
  };

  const handleStartParty = () => {
    setIsPartyStartSheetOpen(false);
    handleNextStep();
  };

  const isPartyEndingFlow = Boolean(partyEndingState);
  const isPartyEnding = Boolean(partyEndingState && !partyEndingState.ended);
  const { data: nextAction } = useRealtimePartyNextAction(partyId, participantToken, isPartyEnded);
  const [isPinataOverlayDismissed, setIsPinataOverlayDismissed] = useState(false);

  useEffect(() => {
    if (partyEndingState?.ended) {
      goToEndStep();
    }
  }, [goToEndStep, partyEndingState?.ended]);

  const endUserRole = useMemo(() => {
    if (!nextAction) {
      return userRole;
    }

    if (nextAction.type === 'HOST_ROLLING_PAPER_LIST') {
      return PARTY_USER.HOST;
    }

    return nextAction.rollingPaperWritten
      ? PARTY_USER.PARTICIPANT_WRITTEN
      : PARTY_USER.PARTICIPANT_NOT_WRITTEN;
  }, [nextAction, userRole]);

  useEffect(() => {
    if (!step || step !== LIVE_PARTY_STEP.PINATA) {
      setIsPinataOverlayDismissed(false);
    }
  }, [step]);

  const isPinataStep = step === LIVE_PARTY_STEP.PINATA;
  const isCloseableStep = step === LIVE_PARTY_STEP.CLOSEABLE;
  const isEntryStep = step === LIVE_PARTY_STEP.ENTRY;
  const showPinataOverlay = isPinataStep && !isPinataOverlayDismissed;
  const isPinataOverlayActive = showPinataOverlay && !isPartyEnding;
  const showHostEndingButton =
    isHost &&
    ((isPinataStep && isPinataOverlayDismissed) || isCloseableStep) &&
    !isPartyEndingFlow &&
    !partyEnd;

  const shouldShowByStep =
    step !== LIVE_PARTY_STEP.ENTRY &&
    step !== LIVE_PARTY_STEP.END &&
    step !== LIVE_PARTY_STEP.CANDLE;

  const showPartyMain =
    isPartyEnding || (isEntryReady && step === LIVE_PARTY_STEP.ENTRY) || shouldShowByStep;
  const showEntryReadyUI = isEntryReady && isEntryStep && !isPartyEndingFlow;

  if (sseError || isPhaseError) {
    return (
      <ErrorView
        variant="retry"
        onPrimaryClick={handleErrorRetry}
        onSecondaryClick={handleErrorBack}
      />
    );
  }

  if (inviteToken && isProfileLoading) {
    return <div className="bg-blue-1000 h-svh w-full" />;
  }

  if (hostGate.isEnded) {
    return (
      <AutoEndedBottomSheet
        onCreateParty={handleCreateParty}
        onHome={handleGoHome}
        onClose={handleGoHome}
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
          onInvite={handleInvite}
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
      {!isPartyEnding && !(isEntryStep && isEntryReady) && (
        <StepRenderer
          step={step}
          onStepComplete={isEntryStep ? handleEntryComplete : handleNextStep}
          showPinataOverlay={showPinataOverlay}
          onReturnToPartyRoom={handleReturnToPartyRoom}
          isHost={isHost}
          userRole={partyEnd ? endUserRole : userRole}
          endAction={nextAction}
          endHostName={hostName}
          candleBlowState={candleBlowState}
          burstGameState={burstGameState}
        />
      )}
      {showEntryReadyUI && isHost && (
        <div className="absolute right-0 bottom-[336px] left-0 z-40 mx-auto flex w-full max-w-[600px] justify-center px-4">
          <Button type="button" size="md" className="w-auto" onClick={handleOpenPartyStartSheet}>
            파티 시작하기
          </Button>
        </div>
      )}

      {isPartyStartSheetOpen && (
        <div className="fixed inset-0 z-60 flex items-end justify-center">
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              isPartyStartSheetVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClosePartyStartSheet}
          />

          <div
            className={`relative transition-transform duration-300 ease-out ${
              isPartyStartSheetVisible ? 'translate-y-0' : 'translate-y-[calc(100%+32px)]'
            }`}
          >
            <PartyStartSheet
              partyId={partyId}
              onClose={handleClosePartyStartSheet}
              onStart={handleStartParty}
            />
          </div>
        </div>
      )}
      {showEntryReadyUI && !isHost && (
        <div className="fixed right-0 bottom-[300px] left-0 z-40 mx-auto flex w-full max-w-[600px] justify-center">
          <div className="flex w-full flex-col items-center justify-center bg-white/10 mask-[linear-gradient(to_bottom,transparent_0%,black_35%)] py-9 backdrop-blur-xs">
            <B1 className="text-center font-semibold text-white/50">파티 시작 준비중이에요...</B1>
          </div>
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
