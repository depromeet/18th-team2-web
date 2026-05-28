import { useEffect, useState } from 'react';

const FIVE_MINUTES_MS = 5 * 60_000;

function getMsUntilStart(startsAt: Date): number {
  return startsAt.getTime() - Date.now();
}

export function usePartyCountdown(startsAt: Date) {
  const [msUntil, setMsUntil] = useState(() => getMsUntilStart(startsAt));

  useEffect(() => {
    const id = setInterval(() => {
      setMsUntil(getMsUntilStart(startsAt));
    }, 60_000);
    return () => clearInterval(id);
  }, [startsAt]);

  return {
    minutesUntil: Math.floor(msUntil / 60_000),
    isWithin5Minutes: msUntil <= FIVE_MINUTES_MS,
    hasStarted: msUntil <= 0,
  };
}
