import { CountdownTimer } from '@/components/rolling-paper/CountdownTimer';
import { Button } from '@/components/ui/Button';

interface RollingPaperShareActionAreaProps {
  writableUntil?: string;
  isActivatingInvite: boolean;
  onShareClick: () => void;
  variant?: 'gradient' | 'solid';
  animate?: boolean;
  buttonLabel?: string;
  showTooltip?: boolean;
}

export function RollingPaperShareActionArea({
  writableUntil,
  isActivatingInvite,
  onShareClick,
  variant = 'gradient',
  animate = false,
  buttonLabel = '롤링페이퍼 공유하기',
  showTooltip = true,
}: RollingPaperShareActionAreaProps) {
  const tooltipBubbleClassName = [
    'relative flex w-fit max-w-[calc(100vw-28px)] items-center justify-center rounded-xl bg-[#000341] px-3 py-2',
    animate ? 'rolling-paper-share-tooltip' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const actionPanelClassName = [
    'absolute right-0 bottom-0 left-0 z-20 px-4 pt-13 pb-[calc(34px+env(safe-area-inset-bottom))] [@media_(max-height:700px)]:pt-11 [@media_(max-height:700px)]:pb-[calc(24px+env(safe-area-inset-bottom))]',
    variant === 'solid'
      ? 'bg-white'
      : 'bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_40.91%)]',
    animate ? 'rolling-paper-action-panel' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={actionPanelClassName}>
      {variant === 'solid' && (
        <div
          aria-hidden
          className="absolute -top-[43px] left-1/2 h-[87px] w-[156%] min-w-[585px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(circle at 28px 44px, #FFFFFF 0 28px, transparent 29px) 0 0 / 57px 87px repeat-x',
          }}
        />
      )}

      {showTooltip && (
        <div className="absolute top-[18px] left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
          <div className={tooltipBubbleClassName}>
            <p className="text-label-1 text-center whitespace-nowrap text-white [@media_(max-width:350px)]:text-[12px] [@media_(max-width:380px)]:text-[13px]">
              공유하고 더 많은 친구들에게 편지를 받아보세요
            </p>
            <span
              aria-hidden
              className="absolute bottom-[-7px] left-4 h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-[#000341]"
            />
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[343px] flex-col items-center gap-2">
        {writableUntil && (
          <CountdownTimer
            targetDate={writableUntil}
            className="text-body-2 text-grey-500 text-center font-medium"
            timeClassName="font-semibold text-red-500"
          />
        )}
        <Button variant="primary" size="full" disabled={isActivatingInvite} onClick={onShareClick}>
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}
