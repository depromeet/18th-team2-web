import ReactCanvasConfetti from 'react-canvas-confetti';
import { useEffect, useRef } from 'react';

import { CONFETTI_COLORS } from '@/constants/live-party';
import { useFirecrackerStore } from '@/stores/useFirecrackerStore';

export function PartyFirecrackerEffect() {
  const confettiRef = useRef<((options: Record<string, unknown>) => void) | null>(null);

  const triggerCount = useFirecrackerStore((state) => state.triggerCount);

  useEffect(() => {
    if (!confettiRef.current || triggerCount === 0) {
      return;
    }

    const firework = () => {
      const x = 0.15 + Math.random() * 0.7;
      const y = 0.1 + Math.random() * 0.35;

      confettiRef.current?.({
        particleCount: 50,
        angle: 360,
        spread: 360,
        startVelocity: 20,
        gravity: 0.9,
        decay: 0.94,
        ticks: 220,
        scalar: 1.2,
        drift: 0,
        shapes: ['square'],
        origin: {
          x,
          y,
        },
        colors: CONFETTI_COLORS,
      });

      // 중심 밝은 코어 느낌
      confettiRef.current?.({
        particleCount: 20,
        spread: 50,
        startVelocity: 10,
        gravity: 0.6,
        decay: 0.92,
        ticks: 180,
        scalar: 0.6,
        shapes: ['square'],
        origin: {
          x,
          y,
        },
        colors: CONFETTI_COLORS,
      });
    };

    firework();

    setTimeout(firework, 400);
  }, [triggerCount]);

  return (
    <ReactCanvasConfetti
      onInit={({ confetti }) => {
        confettiRef.current = confetti;
      }}
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    />
  );
}
