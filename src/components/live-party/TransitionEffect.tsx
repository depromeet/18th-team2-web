interface TransitionEffectProps {
  isTransitioning: boolean;
}

export default function TransitionEffect({ isTransitioning }: TransitionEffectProps) {
  return (
    <div
      aria-hidden
      className={`bg-blue-1000 pointer-events-none absolute inset-0 z-100 transition-opacity duration-500 ${
        isTransitioning ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
