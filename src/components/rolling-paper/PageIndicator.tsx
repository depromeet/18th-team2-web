import { ChevronSmallIcon } from '@/components/ui/icons/ChevronSmallIcon';
import { L1 } from '@/components/ui/Typography';

interface PageIndicatorProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export function PageIndicator({ current, total, onPrev, onNext }: PageIndicatorProps) {
  return (
    <div className="inline-flex h-8 items-center justify-center gap-1 rounded-full bg-black/50 px-2 py-1.5">
      <button
        type="button"
        aria-label="이전 페이지"
        className="flex h-4 w-4 items-center justify-center"
        onClick={onPrev}
        disabled={current <= 1}
      >
        <ChevronSmallIcon direction="left" />
      </button>
      <L1 className="min-w-6.75 text-center font-medium text-white">
        {current} / {total}
      </L1>
      <button
        type="button"
        aria-label="다음 페이지"
        className="flex h-4 w-4 items-center justify-center"
        onClick={onNext}
        disabled={current >= total}
      >
        <ChevronSmallIcon direction="right" />
      </button>
    </div>
  );
}
