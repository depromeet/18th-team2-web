import { L1 } from '@/components/ui/Typography';

interface PageIndicatorProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export function PageIndicator({ current, total, onPrev, onNext }: PageIndicatorProps) {
  return (
    <div
      className="inline-flex items-center justify-center"
      style={{
        height: 32,
        background: 'rgba(0,0,0,0.5)',
        borderRadius: 35,
        padding: '6px 8px',
        gap: 4,
      }}
    >
      <button
        type="button"
        aria-label="이전 페이지"
        className="flex items-center justify-center"
        style={{ width: 16, height: 16 }}
        onClick={onPrev}
        disabled={current <= 1}
      >
        <ChevronSmallIcon direction="left" />
      </button>
      <L1 className="text-center font-medium text-white" style={{ minWidth: 27 }}>
        {current} / {total}
      </L1>
      <button
        type="button"
        aria-label="다음 페이지"
        className="flex items-center justify-center"
        style={{ width: 16, height: 16 }}
        onClick={onNext}
        disabled={current >= total}
      >
        <ChevronSmallIcon direction="right" />
      </button>
    </div>
  );
}

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
