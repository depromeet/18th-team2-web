import { useEffect, useState } from 'react';

import dayjs, { KST } from '@/lib/dayjs';

function getMinutesUntilStart(startsAt: Date): number {
  const now = dayjs().tz(KST);
  const start = dayjs(startsAt).tz(KST);
  return start.diff(now, 'minute');
}

export function usePartyCountdown(startsAt: Date) {
  const [minutesUntil, setMinutesUntil] = useState(() => getMinutesUntilStart(startsAt));

  useEffect(() => {
    const id = setInterval(() => {
      setMinutesUntil(getMinutesUntilStart(startsAt));
    }, 60_000);
    return () => clearInterval(id);
  }, [startsAt]);

  return {
    minutesUntil,
    isWithin5Minutes: minutesUntil <= 5,
    hasStarted: minutesUntil <= 0,
  };
}
