import { useEffect, useState } from 'react';

function getMinutesUntilStart(startsAt: Date): number {
  return Math.floor((startsAt.getTime() - Date.now()) / 60_000);
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
