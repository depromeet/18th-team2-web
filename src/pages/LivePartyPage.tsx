import { useCallback, useEffect, useMemo, useState } from 'react';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  ChatBottomSheet,
  type ChatBottomSheetMetrics,
} from '@/components/live-party/chat/ChatBottomSheet';
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
import { useLivePartyConnection } from '@/hooks/live-party/useLivePartyConnection';
import { useLivePartyCandleStore } from '@/stores/useLivePartyCandleStore';
import { useLivePartyBurstGameStore } from '@/stores/useLivePartyBurstGameStore';
import { useLivePartyStateStore } from '@/stores/useLivePartyStateStore';
import { PartyMainBackground } from '@/components/live-party/main-background/PartyMainBackground';
import {
  CANDLES,
  LIVE_PARTY_STEP,
  MUSIC_LYRICS_TIMINGS,
  PARTICIPANT_TOKEN_KEY,
  PARTY_USER,
  type PartyStep,
} from '@/constants/live-party';
import { ROUTES } from '@/constants/routes';
import { TransitionEffect } from '@/components/live-party/TransitionEffect';
import { PartyFirecrackerEffect } from '@/components/live-party/chat/PartyFirecrackerEffect';
import { useGetMyRealtimeProfile } from '@/services/party-enter';
import {
  useGetPartyParticipants,
  useRealtimePartyNextAction,
  useStartRealtimeEnd,
} from '@/services/live-party';
import { Loading } from '@/components/ui/Loading';
import { ErrorView } from '@/components/ui/ErrorView';
import { PartyStartSheet } from '@/components/live-party/PartyStartSheet';
import { PartyEntryReadyOverlay } from '@/components/live-party/entry/PartyEntryReadyOverlay';
import { PINATA_DURATION_SECONDS } from '@/hooks/live-party/usePinataStep';
import { parseKstDateTime } from '@/utils/date';

const PROCESS_PROGRESS_SYNC_INTERVAL_MS = 250;
const MUSIC_PROCESS_DURATION_SECONDS = MUSIC_LYRICS_TIMINGS[MUSIC_LYRICS_TIMINGS.length - 1].end;
const PARTY_ENDING_FALLBACK_SECONDS = 60;

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function getTimestamp(value?: string | null) {
  if (!value) return null;

  const dateTime = parseKstDateTime(value);
  if (!dateTime.isValid()) return null;

  return dateTime.valueOf();
}

function getServerClockOffset(serverNow?: string | null) {
  const serverNowMs = getTimestamp(serverNow);

  return serverNowMs == null ? 0 : Date.now() - serverNowMs;
}

export default function LivePartyPage() {
  const { partyId = '' } = useParams<{ partyId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as {
    inviteToken?: string;
    hostName?: string;
    nickname?: string;
  } | null;
  const inviteToken = locationState?.inviteToken ?? '';
  const participantToken = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(PARTICIPANT_TOKEN_KEY);
    };
  }, []);

  const { addMessage } = useLivePartyConnection();
  const candleBlowState = useLivePartyCandleStore((s) => s.candleBlowState);
  const burstGameState = useLivePartyBurstGameStore((s) => s.burstGameState);
  const partyEndingState = useLivePartyStateStore((s) => s.partyEndingState);
  const currentPhase = useLivePartyStateStore((s) => s.currentPhase);
  const currentPhaseStartedAt = useLivePartyStateStore((s) => s.currentPhaseStartedAt);
  const currentPhaseServerNow = useLivePartyStateStore((s) => s.currentPhaseServerNow);
  const hasParticipantToken = useLivePartyStateStore((s) => s.hasParticipantToken);
  const wsError = useLivePartyStateStore((s) => s.wsError);
  const nicknameDuplicate = useLivePartyStateStore((s) => s.nicknameDuplicate);

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
  }, [
    nicknameDuplicate,
    navigate,
    partyId,
    inviteToken,
    locationState?.hostName,
    locationState?.nickname,
  ]);

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
    liveStartedAt,
    liveStartedServerNow,
  } = useLivePartyStep({
    partyId,
    partyPhase: currentPhase,
    partyPhaseStartedAt: currentPhaseStartedAt,
    serverNow: currentPhaseServerNow,
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
  const [processCompletedStep, setProcessCompletedStep] = useState<PartyStep | null>(null);
  const [processProgressNowMs, setProcessProgressNowMs] = useState(() => Date.now());
  const [chatSheetMetrics, setChatSheetMetrics] = useState<ChatBottomSheetMetrics>({
    height: 0,
    bottomOffset: 0,
    isExpanded: false,
  });
  const liveServerClockOffsetMs = useMemo(
    () => getServerClockOffset(liveStartedServerNow),
    [liveStartedServerNow],
  );
  const burstServerClockOffsetMs = useMemo(
    () => getServerClockOffset(burstGameState?.serverTime),
    [burstGameState?.serverTime],
  );

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

  const handleReturnToPartyRoom = useCallback(() => {
    setIsPinataOverlayDismissed(true);
  }, []);

  const handleProcessComplete = useCallback((completedStep: PartyStep) => {
    setProcessCompletedStep(completedStep);
  }, []);

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
  const endingReason = partyEndingState?.endingReason ?? hostGate.state?.endingReason;
  const shouldShowAutoEndedSheet =
    hostGate.isEnded && Boolean(endingReason) && endingReason !== 'HOST_REQUEST';

  useEffect(() => {
    if (partyEndingState?.ended) {
      goToEndStep();
    }
  }, [goToEndStep, partyEndingState?.ended]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setProcessProgressNowMs(Date.now());
    }, PROCESS_PROGRESS_SYNC_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, []);

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

  useEffect(() => {
    if (!processCompletedStep) return;

    if (processCompletedStep === LIVE_PARTY_STEP.PINATA) {
      if (isPartyEnding || partyEnd) {
        setProcessCompletedStep(null);
      }
      return;
    }

    if (step !== processCompletedStep) {
      setProcessCompletedStep(null);
    }
  }, [isPartyEnding, partyEnd, processCompletedStep, step]);

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
  const visibleProcessCompletedStep =
    !isPartyEnding && processCompletedStep === step ? processCompletedStep : null;

  const activeProcessProgressRatio = useMemo(() => {
    if (visibleProcessCompletedStep) {
      return 1;
    }

    if (isPartyEnding) {
      const endingStartedAt = getTimestamp(partyEndingState?.endingStartedAt);
      const endedAt =
        getTimestamp(partyEndingState?.endedAt) ??
        (endingStartedAt == null ? null : endingStartedAt + PARTY_ENDING_FALLBACK_SECONDS * 1000);

      if (endingStartedAt == null || endedAt == null || endedAt <= endingStartedAt) return 0;

      return clampProgress((processProgressNowMs - endingStartedAt) / (endedAt - endingStartedAt));
    }

    if (step === LIVE_PARTY_STEP.MUSIC) {
      const musicStartedAt = getTimestamp(liveStartedAt);
      if (musicStartedAt == null) return 0;

      const serverNowMs = processProgressNowMs - liveServerClockOffsetMs;
      const elapsedSeconds = (serverNowMs - musicStartedAt) / 1000;

      return clampProgress(elapsedSeconds / MUSIC_PROCESS_DURATION_SECONDS);
    }

    if (step === LIVE_PARTY_STEP.CANDLE) {
      const serverCandles = candleBlowState?.candles ?? [];
      const extinguishedCount = serverCandles.filter((candle) => candle.extinguished).length;

      return clampProgress(extinguishedCount / CANDLES.length);
    }

    if (step === LIVE_PARTY_STEP.PINATA) {
      const startedAt = getTimestamp(burstGameState?.startedAt);
      const endsAt = getTimestamp(burstGameState?.endsAt);

      if (startedAt != null && endsAt != null && endsAt > startedAt) {
        const serverNowMs = processProgressNowMs - burstServerClockOffsetMs;
        return clampProgress((serverNowMs - startedAt) / (endsAt - startedAt));
      }

      if (burstGameState?.remainingSeconds != null) {
        return clampProgress(1 - burstGameState.remainingSeconds / PINATA_DURATION_SECONDS);
      }
    }

    return 0;
  }, [
    burstGameState?.endsAt,
    burstGameState?.remainingSeconds,
    burstGameState?.startedAt,
    candleBlowState?.candles,
    burstServerClockOffsetMs,
    liveStartedAt,
    liveServerClockOffsetMs,
    isPartyEnding,
    partyEndingState?.endedAt,
    partyEndingState?.endingStartedAt,
    visibleProcessCompletedStep,
    processProgressNowMs,
    step,
  ]);

  const shouldShowByStep =
    step !== LIVE_PARTY_STEP.ENTRY &&
    step !== LIVE_PARTY_STEP.END &&
    step !== LIVE_PARTY_STEP.CANDLE;

  const showPartyMain =
    isPartyEnding || (isEntryReady && step === LIVE_PARTY_STEP.ENTRY) || shouldShowByStep;
  const showEntryReadyUI = isEntryReady && isEntryStep && !isPartyEndingFlow;
  const hasChatTopOverlayContent = step === LIVE_PARTY_STEP.MUSIC || isPartyEnding;
  const musicTextBottomOffset =
    step === LIVE_PARTY_STEP.MUSIC && chatSheetMetrics.isExpanded
      ? chatSheetMetrics.height + chatSheetMetrics.bottomOffset
      : undefined;
  const { data: entryParticipantsData } = useGetPartyParticipants(partyId, {
    enabled: canFetch && showPartyMain,
  });

  if (wsError || isPhaseError) {
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

  if (shouldShowAutoEndedSheet) {
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
      className={`relative h-svh w-full max-w-150 bg-cover bg-center bg-no-repeat [--live-party-chat-min-height:283px] [@media_(max-height:699px)]:[--live-party-chat-min-height:260px] ${partyEnd ? 'backdrop-blur-lg' : 'bg-blue-1000'} `}
    >
      {(!canFetch || !isInitialized) && <Loading />}
      {showPartyMain && <PartyFirecrackerEffect />}
      {!partyEnd && (
        <LivePartyHeader
          onExitClick={handleOpenExitDialog}
          musicIsMuted={musicIsMuted}
          handleToggleMute={handleToggleMute}
          step={step}
          showMuteButton={step !== LIVE_PARTY_STEP.ENTRY}
          forceShowMusicButton={showEntryReadyUI}
          isPartyEnding={isPartyEnding}
          completedStep={visibleProcessCompletedStep}
          activeProgressRatio={activeProcessProgressRatio}
          liveStartAt={liveStartedAt}
          serverNow={liveStartedServerNow}
        />
      )}
      {showPartyMain && !showEntryReadyUI && (
        <PartyMainBackground isBlurred={isPinataOverlayActive} />
      )}
      {showEntryReadyUI && (
        <PartyEntryReadyOverlay isHost={isHost} onStartClick={handleOpenPartyStartSheet} />
      )}
      {!isPartyEnding && !(isEntryStep && isEntryReady) && (
        <StepRenderer
          step={step}
          onStepComplete={isEntryStep ? handleEntryComplete : handleNextStep}
          onProcessComplete={handleProcessComplete}
          showPinataOverlay={showPinataOverlay}
          onReturnToPartyRoom={handleReturnToPartyRoom}
          isHost={isHost}
          userRole={partyEnd ? endUserRole : userRole}
          endAction={nextAction}
          endHostName={hostName}
          musicTextBottomOffset={musicTextBottomOffset}
        />
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
      {showHostEndingButton && (
        <div className="absolute right-0 bottom-[calc(var(--live-party-chat-min-height)+32px)] left-0 z-40 mx-auto flex w-full max-w-150 justify-center px-4 [@media_(max-height:700px)]:bottom-[calc(var(--live-party-chat-min-height)+24px)]">
          <Button
            type="button"
            size="md"
            className="h-[46px] w-auto rounded-[12px] bg-blue-500/90 px-7 py-3 text-[15px] leading-[22px] shadow-[0_12px_28px_rgba(0,3,65,0.24)]"
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
          onSend={addMessage}
          isBlurred={isPinataOverlayActive}
          isEntryWaiting={showEntryReadyUI}
          hasTopOverlayContent={hasChatTopOverlayContent}
          onMetricsChange={setChatSheetMetrics}
          participantCount={entryParticipantsData?.totalCount}
          maxParticipantCount={entryParticipantsData?.maxCount}
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
