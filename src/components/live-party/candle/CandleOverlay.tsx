interface CandleOverlayProps {
  opacity: number;
}

export function CandleOverlay({ opacity }: CandleOverlayProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#FFB200_-50%,transparent_100%)] transition-opacity duration-700 ease-out"
      style={{ opacity }}
    />
  );
}
