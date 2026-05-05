import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
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
        className="flex h-4 w-4 cursor-pointer items-center justify-center"
        onClick={onPrev}
        disabled={current <= 1}
      >
        <ChevronLeftIcon width={16} height={16} className="text-grey-200" />
      </button>
      <L1 className="min-w-6.75 text-center font-medium text-white">
        {current} / {total}
      </L1>
      <button
        type="button"
        aria-label="다음 페이지"
        className="flex h-4 w-4 cursor-pointer items-center justify-center"
        onClick={onNext}
        disabled={current >= total}
      >
        <ChevronRightIcon width={16} height={16} className="text-grey-200" />
      </button>
    </div>
  );
}
