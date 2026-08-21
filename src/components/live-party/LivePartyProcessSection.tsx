import { LIVE_PARTY_STEP, type PartyStep } from '@/constants/live-party';

const PROCESS_STEPS = ['축하노래', '촛불끄기', '박 터뜨리기', '마무리'] as const;

type ProcessStatus = 'active' | 'completed' | 'pending';

interface ProcessItem {
  label: (typeof PROCESS_STEPS)[number];
  status: ProcessStatus;
}

interface LivePartyProcessSectionProps {
  step: PartyStep;
  isPartyEnding?: boolean;
  completedStep?: PartyStep | null;
  activeProgressRatio?: number;
}

function getProcessIndex(step: PartyStep) {
  const activeIndexByStep: Partial<Record<PartyStep, number>> = {
    MUSIC: 0,
    CANDLE: 1,
    PINATA: 2,
    CLOSEABLE: 3,
  };

  return activeIndexByStep[step] ?? null;
}

function getCompletedProcessItems(completedStep: PartyStep): ProcessItem[] | null {
  const completedIndex = getProcessIndex(completedStep);

  if (completedIndex == null || completedIndex >= PROCESS_STEPS.length - 1) {
    return null;
  }

  return PROCESS_STEPS.slice(completedIndex).map((label, index) => ({
    label,
    status: index === 0 ? 'completed' : 'pending',
  }));
}

function getProcessItems(
  step: PartyStep,
  isPartyEnding = false,
  completedStep?: PartyStep | null,
): ProcessItem[] {
  if (completedStep) {
    const completedItems = getCompletedProcessItems(completedStep);

    if (completedItems) {
      return completedItems;
    }
  }

  if (isPartyEnding) {
    return PROCESS_STEPS.slice(3).map((label) => ({
      label,
      status: 'active',
    }));
  }

  if (step === LIVE_PARTY_STEP.CLOSEABLE) {
    return PROCESS_STEPS.slice(3).map((label) => ({
      label,
      status: 'active',
    }));
  }

  const activeIndex = getProcessIndex(step) ?? 0;

  return PROCESS_STEPS.slice(activeIndex).map((label, index) => ({
    label,
    status: index === 0 ? 'active' : 'pending',
  }));
}

function ProcessIcon({ status }: { status: ProcessStatus }) {
  if (status === 'completed') {
    return (
      <span className="relative size-4 rounded-full bg-[#5892ff]">
        <span className="absolute top-[4px] left-[4px] h-[5px] w-[8px] -rotate-45 border-b-2 border-l-2 border-white" />
      </span>
    );
  }

  return (
    <span
      className={`size-1.5 rounded-full ${status === 'active' ? 'bg-[#5892ff]' : 'bg-white/40'}`}
    />
  );
}

function ProcessStepItem({
  label,
  status,
  activeProgressRatio,
}: ProcessItem & { activeProgressRatio: number }) {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const activeProgressWidth = 17 + (72 - 17) * activeProgressRatio;

  return (
    <div className="w-[76px] shrink-0 p-0.5">
      <div className="mb-1.5 h-[3px] w-[72px] overflow-hidden rounded-full bg-white/15">
        {(isCompleted || isActive) && (
          <div
            className={`h-full rounded-full bg-[#5892ff] transition-[width] duration-500 ease-linear ${
              isCompleted ? 'w-full opacity-50' : ''
            }`}
            style={isActive ? { width: `${activeProgressWidth}px` } : undefined}
          />
        )}
      </div>
      <div className="flex h-[18px] items-center gap-1.5 overflow-hidden">
        <ProcessIcon status={status} />
        <span
          className={`truncate text-[13px] leading-[18px] whitespace-nowrap ${
            isCompleted ? 'text-[#5892ff]' : isActive ? 'text-white' : 'text-white/55'
          } ${isActive || isCompleted ? 'font-bold' : 'font-semibold'}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export function LivePartyProcessSection({
  step,
  isPartyEnding = false,
  completedStep = null,
  activeProgressRatio = 0,
}: LivePartyProcessSectionProps) {
  const items = getProcessItems(step, isPartyEnding, completedStep);
  const shouldFadeTrailingSteps = items.length > 2;
  const normalizedActiveProgressRatio = Math.min(1, Math.max(0, activeProgressRatio));

  return (
    <div
      className="relative h-10 min-w-0 overflow-hidden"
      aria-label="파티 진행현황"
      style={
        shouldFadeTrailingSteps
          ? {
              WebkitMaskImage:
                'linear-gradient(to right, #000 calc(100% - 72px), transparent 100%)',
              maskImage: 'linear-gradient(to right, #000 calc(100% - 72px), transparent 100%)',
            }
          : undefined
      }
    >
      <div className="flex w-max gap-1.5">
        {items.map((item) => (
          <ProcessStepItem
            key={`${item.label}-${item.status}`}
            {...item}
            activeProgressRatio={normalizedActiveProgressRatio}
          />
        ))}
      </div>
    </div>
  );
}
