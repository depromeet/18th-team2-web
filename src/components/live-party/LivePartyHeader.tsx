import { memo, useEffect, useMemo, useState } from 'react';

import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { LIVE_PARTY_STEP, type PartyStep } from '@/constants/live-party';
import { PARTY_DURATION_MINUTES } from '@/constants/partyCreate';
import { LivePartyProcessSection } from '@/components/live-party/LivePartyProcessSection';
import { parseKstDateTime } from '@/utils/date';
import musicPlayIcon from '@/assets/images/live-party/music-play.png';
import musicMutedIcon from '@/assets/images/live-party/music-muted.png';

const LIVE_PARTY_DURATION_SECONDS = PARTY_DURATION_MINUTES * 60;

interface LivePartyHeaderProps {
  onExitClick: () => void;
  step: PartyStep;
  showMuteButton?: boolean;
  handleToggleMute: () => void;
  musicIsMuted: boolean;
  forceShowMusicButton?: boolean;
  isPartyEnding?: boolean;
  completedStep?: PartyStep | null;
  activeProgressRatio?: number;
  liveStartAt?: string | null;
  liveDeadlineAt?: string | null;
  serverNow?: string | null;
}

function getTimestamp(value?: string | null) {
  if (!value) return null;

  const dateTime = parseKstDateTime(value);
  if (!dateTime.isValid()) return null;

  return dateTime.valueOf();
}

function getLiveTiming(liveStartAt?: string | null, liveDeadlineAt?: string | null) {
  const startAt = getTimestamp(liveStartAt);
  const deadlineAt =
    getTimestamp(liveDeadlineAt) ??
    (startAt != null ? startAt + LIVE_PARTY_DURATION_SECONDS * 1000 : null);

  return { startAt, deadlineAt };
}

function getCurrentTime(serverClockOffsetMs: number) {
  return Date.now() - serverClockOffsetMs;
}

function getRemainingSeconds(
  liveStartAt?: string | null,
  liveDeadlineAt?: string | null,
  serverClockOffsetMs = 0,
) {
  const { deadlineAt } = getLiveTiming(liveStartAt, liveDeadlineAt);
  if (deadlineAt == null) return LIVE_PARTY_DURATION_SECONDS;

  return Math.min(
    LIVE_PARTY_DURATION_SECONDS,
    Math.max(0, Math.ceil((deadlineAt - getCurrentTime(serverClockOffsetMs)) / 1000)),
  );
}

function formatRemainingTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export const LivePartyHeader = memo(function LivePartyHeader({
  onExitClick,
  step,
  showMuteButton,
  handleToggleMute,
  musicIsMuted,
  forceShowMusicButton = false,
  isPartyEnding = false,
  completedStep = null,
  activeProgressRatio = 0,
  liveStartAt,
  liveDeadlineAt,
  serverNow,
}: LivePartyHeaderProps) {
  const showMusicButton =
    forceShowMusicButton || (showMuteButton ?? step !== LIVE_PARTY_STEP.ENTRY);
  const showProcessSection = step !== LIVE_PARTY_STEP.ENTRY;
  const shouldShadeHeader =
    step === LIVE_PARTY_STEP.MUSIC || step === LIVE_PARTY_STEP.CLOSEABLE || isPartyEnding;
  const serverClockOffsetMs = useMemo(() => {
    const serverNowMs = getTimestamp(serverNow);
    return serverNowMs == null ? 0 : Date.now() - serverNowMs;
  }, [serverNow]);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(liveStartAt, liveDeadlineAt, serverClockOffsetMs),
  );
  const remainingTimeLabel = useMemo(
    () => formatRemainingTime(remainingSeconds),
    [remainingSeconds],
  );

  useEffect(() => {
    setRemainingSeconds(getRemainingSeconds(liveStartAt, liveDeadlineAt, serverClockOffsetMs));

    if (!showProcessSection) return;

    const id = window.setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(liveStartAt, liveDeadlineAt, serverClockOffsetMs));
    }, 1000);

    return () => window.clearInterval(id);
  }, [liveDeadlineAt, liveStartAt, serverClockOffsetMs, showProcessSection]);

  return (
    <header
      className={`absolute top-0 right-0 left-0 z-[70] mx-auto w-full max-w-150 px-3 pt-[calc(env(safe-area-inset-top)+16px)] pb-6 sm:px-4 ${
        shouldShadeHeader ? 'bg-gradient-to-b from-[#000341] to-transparent' : ''
      }`}
    >
      <div className="flex w-full items-center">
        {showMusicButton && (
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={musicIsMuted ? '음악 켜기' : '음악 끄기'}
            className="flex size-9 shrink-0 items-center justify-center"
          >
            {musicIsMuted ? (
              <img src={musicMutedIcon} alt="" className="h-9 w-9 transform-[translateZ(0)]" />
            ) : (
              <img src={musicPlayIcon} alt="" className="h-9 w-9 transform-[translateZ(0)]" />
            )}
          </button>
        )}
        {showProcessSection && (
          <>
            <div className="ml-2 min-w-0 flex-1 sm:ml-3">
              <LivePartyProcessSection
                step={step}
                isPartyEnding={isPartyEnding}
                completedStep={completedStep}
                activeProgressRatio={activeProgressRatio}
              />
            </div>
            <div className="ml-2 flex min-w-12 shrink-0 items-center justify-center rounded-[20px] bg-white/15 px-2 py-2 text-[12px] leading-4 font-semibold text-white/70 sm:ml-3 sm:px-2.5">
              {remainingTimeLabel}
            </div>
          </>
        )}
        <button
          type="button"
          onClick={onExitClick}
          aria-label="파티 나가기"
          className={`flex size-8 shrink-0 items-center justify-center sm:size-9 ${showProcessSection ? 'ml-2 sm:ml-3' : 'ml-auto'}`}
        >
          <CloseIcon className="text-white" />
        </button>
      </div>
    </header>
  );
});
