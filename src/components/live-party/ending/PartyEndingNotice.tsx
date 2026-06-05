import { useEffect, useMemo, useState } from 'react';

import { B1, H2 } from '@/components/ui/Typography';
import type { RealtimePartyEndingState } from '@/hooks/live-party/useLivePartySSE';
import { parseKstDateTime } from '@/utils/date';

const INTRO_STEP_DURATION = 2000;
const FALLBACK_REMAINING_SECONDS = 60;

type NoticeStep = 'title' | 'thanks' | 'countdown';

interface PartyEndingNoticeProps {
  partyEndingState: RealtimePartyEndingState;
}

function getRemainingSeconds({ endedAt, endingStartedAt }: RealtimePartyEndingState) {
  if (endedAt) {
    const endTime = parseKstDateTime(endedAt);

    if (endTime.isValid()) {
      return Math.max(0, Math.ceil((endTime.valueOf() - Date.now()) / 1000));
    }
  }

  if (endingStartedAt) {
    const startTime = parseKstDateTime(endingStartedAt);

    if (startTime.isValid()) {
      const elapsedSeconds = Math.floor((Date.now() - startTime.valueOf()) / 1000);
      return Math.max(0, FALLBACK_REMAINING_SECONDS - elapsedSeconds);
    }
  }

  return FALLBACK_REMAINING_SECONDS;
}

export function PartyEndingNotice({ partyEndingState }: PartyEndingNoticeProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(partyEndingState),
  );
  const [noticeStep, setNoticeStep] = useState<NoticeStep>(() =>
    getRemainingSeconds(partyEndingState) <= 55 ? 'countdown' : 'title',
  );

  useEffect(() => {
    setRemainingSeconds(getRemainingSeconds(partyEndingState));

    const intervalId = window.setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(partyEndingState));
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
      return <H2 className="text-center font-bold text-white">파티가 모두 끝났어요!</H2>;
    }

    if (noticeStep === 'thanks') {
      return <H2 className="text-center font-bold text-white">모두 참석해주셔서 고마워요</H2>;
    }

    return (
      <div className="flex flex-col items-center gap-1 text-center">
        <H2 className="font-bold text-white">
          <span className="text-red-400">{remainingSeconds}초</span> 후 파티가 사라져요
        </H2>
        <B1 className="font-semibold text-white">마무리 인사를 해주세요</B1>
      </div>
    );
  }, [noticeStep, remainingSeconds]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 bottom-[320px] z-20 mx-auto flex w-full max-w-[600px] items-center justify-center px-6">
      <div className="transition-opacity duration-300 ease-out">{content}</div>
    </div>
  );
}
