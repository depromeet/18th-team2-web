import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { RefreshIcon } from '@/components/ui/icons/RefreshIcon';

interface RollingPaperSceneHeaderProps {
  onBack: () => void;
  onRefresh: () => void;
  className?: string;
  backButtonClassName?: string;
}

export function RollingPaperSceneHeader({
  onBack,
  onRefresh,
  className = 'pt-safe-top-3 z-30 px-2',
  backButtonClassName = '',
}: RollingPaperSceneHeaderProps) {
  return (
    <header className={`relative flex items-center justify-between ${className}`}>
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={onBack}
        className={`flex h-12 w-12 cursor-pointer items-center justify-center text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${backButtonClassName}`}
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <button
        type="button"
        aria-label="새로고침"
        onClick={onRefresh}
        className="flex h-12 w-12 cursor-pointer items-center justify-center text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      >
        <RefreshIcon className="h-6 w-6" />
      </button>
    </header>
  );
}
