import { useCallback, useRef } from 'react';

import { CONFETTI_COLORS } from '@/constants/live-party';

export function useFallConfetti() {
  const confettiRef = useRef<((options: Record<string, unknown>) => void) | null>(null);

  const handleInitConfetti = useCallback(
    ({ confetti }: { confetti: (options: Record<string, unknown>) => void }) => {
      confettiRef.current = confetti;
    },
    [],
  );

  const fireConfetti = useCallback(() => {
    confettiRef.current?.({
      particleCount: 40,
      spread: 50,
      startVelocity: 90,
      gravity: 1.0,
      scalar: 1.5,
      ticks: 400,
      drift: 0,
      shapes: 'square',
      angle: 90,
      origin: {
        x: 0.5,
        y: 1.1,
      },
      colors: CONFETTI_COLORS,
    });
  }, []);

  return {
    handleInitConfetti,
    fireConfetti,
  };
}
