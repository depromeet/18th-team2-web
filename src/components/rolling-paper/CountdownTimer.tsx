import { useEffect, useRef, useState } from 'react';

import { B2 } from '@/components/ui/Typography';
import { parseKstDateTime } from '@/utils/date';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  timeClassName?: string;
  onComplete?: () => void;
}

function formatParts(ms: number) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function getRemainingMs(targetDate: string) {
  return parseKstDateTime(targetDate).valueOf() - Date.now();
}

export function CountdownTimer({
  targetDate,
  className = 'text-grey-500 text-center font-medium',
  timeClassName = 'font-semibold text-red-500',
  onComplete,
}: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => getRemainingMs(targetDate));
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    function updateRemaining() {
      const next = getRemainingMs(targetDate);
      if (next <= 0) {
        setRemaining(0);
        onCompleteRef.current?.();
        return false;
      }

      setRemaining(next);
      return true;
    }

    if (!updateRemaining()) return;

    const timer = setInterval(() => {
      if (!updateRemaining()) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (remaining <= 0) return null;

  const { days, hours, minutes, seconds } = formatParts(remaining);
  const timeText = `${days}일 ${hours}시간 ${String(minutes).padStart(2, '0')}분 ${String(seconds).padStart(2, '0')}초`;

  return (
    <B2 as="p" className={className}>
      작성 가능한 시간 <span className={timeClassName}>{timeText}</span>
    </B2>
  );
}
