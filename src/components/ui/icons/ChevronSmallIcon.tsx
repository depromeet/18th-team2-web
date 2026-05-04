export function ChevronSmallIcon({ direction }: { direction: 'left' | 'right' }) {
  const d =
    direction === 'left'
      ? 'M9.33 3.07L4.67 7.73 9.33 12.4'
      : 'M6.67 3.07L11.33 7.73 6.67 12.4';

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={d}
        stroke="#BEBEBF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
