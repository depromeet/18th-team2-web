import { useEffect, useMemo, useRef, useState } from 'react';
import Lottie from 'lottie-react';

import { B1 } from '@/components/ui/Typography';
import type { RealtimePartyEndingState } from '@/hooks/live-party/useLivePartyWebSocket';
import { parseKstDateTime } from '@/utils/date';
import loadingBarAnimation from '@/assets/images/live-party/loading-bar.json';

const INTRO_STEP_DURATION = 2000;
const FALLBACK_REMAINING_SECONDS = 60;

type NoticeStep = 'title' | 'thanks' | 'countdown';

interface PartyEndingNoticeProps {
  partyEndingState: RealtimePartyEndingState;
}

function getTitleMessage({ endingReason, hostNickname }: RealtimePartyEndingState) {
  if (endingReason === 'HOST_LEFT') {
    return `${hostNickname ?? '주최자'}님이 파티를 떠났어요`;
  }

  return '파티가 모두 끝났어요!';
}

function getServerClockOffset(serverNow?: string | null) {
  if (!serverNow) return null;

  const serverNowTime = parseKstDateTime(serverNow);
  if (!serverNowTime.isValid()) return null;

  return Date.now() - serverNowTime.valueOf();
}

function getRemainingSeconds(
  { endedAt, endingStartedAt }: RealtimePartyEndingState,
  serverClockOffsetMs = 0,
) {
  const nowOnServer = Date.now() - serverClockOffsetMs;

  if (endedAt) {
    const endTime = parseKstDateTime(endedAt);

    if (endTime.isValid()) {
      return Math.max(0, Math.ceil((endTime.valueOf() - nowOnServer) / 1000));
    }
  }

  if (endingStartedAt) {
    const startTime = parseKstDateTime(endingStartedAt);

    if (startTime.isValid()) {
      const elapsedSeconds = Math.floor((nowOnServer - startTime.valueOf()) / 1000);
      return Math.max(0, FALLBACK_REMAINING_SECONDS - elapsedSeconds);
    }
  }

  return FALLBACK_REMAINING_SECONDS;
}

export function PartyEndingNotice({ partyEndingState }: PartyEndingNoticeProps) {
  const isHostLeft = partyEndingState.endingReason === 'HOST_LEFT';
  const serverClockOffsetRef = useRef(0);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(partyEndingState),
  );
  const [noticeStep, setNoticeStep] = useState<NoticeStep>(() =>
    getRemainingSeconds(partyEndingState) <= 55 ? 'countdown' : 'title',
  );

  useEffect(() => {
    const serverClockOffset = getServerClockOffset(partyEndingState.serverNow);

    if (serverClockOffset != null) {
      serverClockOffsetRef.current = serverClockOffset;
    }

    setRemainingSeconds(getRemainingSeconds(partyEndingState, serverClockOffsetRef.current));

    const intervalId = window.setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(partyEndingState, serverClockOffsetRef.current));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [partyEndingState]);

  useEffect(() => {
    if (noticeStep === 'countdown') {
      return;
    }

    const nextStep = noticeStep === 'title' ? 'thanks' : 'countdown';
    const timeoutId = window.setTimeout(() => {
      setNoticeStep(nextStep);
    }, INTRO_STEP_DURATION);

    return () => window.clearTimeout(timeoutId);
  }, [noticeStep]);

  const content = useMemo(() => {
    if (noticeStep === 'title') {
      return (
        <B1 className="text-center leading-6 font-semibold break-keep text-white">
          {getTitleMessage(partyEndingState)}
        </B1>
      );
    }

    if (noticeStep === 'thanks') {
      return (
        <B1 className="text-center leading-6 font-semibold break-keep text-white">
          모두 참석해주셔서 고마워요
        </B1>
      );
    }

    return (
      <div className="flex flex-col items-center gap-1 text-center leading-6 font-semibold break-keep text-white">
        <B1 className="leading-6 font-semibold text-white">
          <span className="text-red-400">{remainingSeconds}초</span> 후 파티가 사라져요
        </B1>
        <B1 className="leading-6 font-semibold text-white">마무리 인사를 해주세요</B1>
      </div>
    );
  }, [noticeStep, partyEndingState, remainingSeconds]);

  if (isHostLeft) {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-0 bottom-[var(--live-party-chat-min-height,320px)] z-[65] mx-auto w-full max-w-150 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[min(65svh,529px)] bg-gradient-to-b from-[#000341]/0 to-[#000341] backdrop-blur-[40px]"
        />

        <div className="absolute top-[clamp(220px,31svh,251px)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-center">
          <Lottie animationData={loadingBarAnimation} className="h-9 w-9" loop />
          <p className="max-w-[calc(100vw-32px)] text-[18px] leading-[26px] font-semibold break-keep text-white/60">
            <span>{partyEndingState.hostNickname ?? '주최자'}님이 파티를 떠났어요</span>
            <br />
            <span>
              <span className="text-[#5892ff]">10분</span> 동안 돌아오지 않으면 파티가 사라져요
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(100svh-var(--live-party-chat-min-height,283px)-96px)] z-20 mx-auto flex w-full max-w-[600px] justify-center px-6 [@media_(max-height:700px)]:top-[calc(100svh-var(--live-party-chat-min-height,260px)-84px)]">
      <div className="relative transition-opacity duration-300 ease-out">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -inset-y-5 bg-linear-to-b from-[#000341]/0 via-[#000341]/45 to-[#000341]/0 blur-[15px]"
        />
        <div className="relative z-10">{content}</div>
      </div>
    </div>
  );
}
