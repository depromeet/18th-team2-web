import { useEffect, useState } from 'react';

import { B2 } from '@/components/ui/Typography';

interface CountdownTimerProps {
  targetDate: string;
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

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => new Date(targetDate).getTime() - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const next = new Date(targetDate).getTime() - Date.now();
      if (next <= 0) {
        setRemaining(0);
        clearInterval(timer);
      } else {
        setRemaining(next);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (remaining <= 0) return null;

  const { days, hours, minutes, seconds } = formatParts(remaining);
  const timeText = `${days}일 ${hours}시간 ${String(minutes).padStart(2, '0')}분 ${String(seconds).padStart(2, '0')}초`;

  return (
    <B2 as="p" className="text-center font-medium text-grey-500">
      작성 가능한 시간{' '}
      <span className="font-semibold text-red-500">{timeText}</span>
    </B2>
  );
}
