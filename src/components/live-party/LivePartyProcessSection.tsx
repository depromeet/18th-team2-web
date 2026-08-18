import { LIVE_PARTY_STEP, type PartyStep } from '@/constants/live-party';

const PROCESS_STEPS = ['축하노래', '촛불끄기', '박 터뜨리기', '마무리'] as const;

type ProcessStatus = 'active' | 'completed' | 'pending';

interface ProcessItem {
  label: (typeof PROCESS_STEPS)[number];
  status: ProcessStatus;
  stepIndex: number;
}

interface LivePartyProcessSectionProps {
  step: PartyStep;
  isPartyEnding?: boolean;
  progressRatio?: number;
}

function getProcessItems(step: PartyStep, isPartyEnding = false): ProcessItem[] {
  if (isPartyEnding) {
    return PROCESS_STEPS.slice(3).map((label) => ({
      label,
      status: 'active',
      stepIndex: 3,
    }));
  }

  if (step === LIVE_PARTY_STEP.CLOSEABLE) {
    return PROCESS_STEPS.slice(3).map((label) => ({
      label,
      status: 'active',
      stepIndex: 3,
    }));
  }

  const activeIndexByStep: Partial<Record<PartyStep, number>> = {
    MUSIC: 0,
    CANDLE: 1,
    PINATA: 2,
  };
  const activeIndex = activeIndexByStep[step] ?? 0;

  return PROCESS_STEPS.slice(activeIndex).map((label, index) => ({
    label,
    status: index === 0 ? 'active' : 'pending',
    stepIndex: index + activeIndex,
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

function getActiveBarProgress(progressRatio: number, stepIndex: number) {
  const initialProgress = 17 / 72;
  const segmentProgress = progressRatio * PROCESS_STEPS.length - stepIndex;

  return Math.min(1, initialProgress + Math.max(0, segmentProgress) * (1 - initialProgress));
}

function ProcessStepItem({
  label,
  status,
  stepIndex,
  progressRatio,
}: ProcessItem & { progressRatio: number }) {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const activeBarProgress = getActiveBarProgress(progressRatio, stepIndex);

  return (
    <div className="w-[76px] shrink-0 p-0.5">
      <div className="mb-1.5 h-[3px] w-[72px] overflow-hidden rounded-full bg-white/15">
        {(isCompleted || isActive) && (
          <div
            className={`h-full rounded-full bg-[#5892ff] transition-[width] duration-500 ease-linear ${
              isCompleted ? 'w-full opacity-50' : ''
            }`}
            style={isActive ? { width: `${activeBarProgress * 100}%` } : undefined}
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
  progressRatio = 0,
}: LivePartyProcessSectionProps) {
  const items = getProcessItems(step, isPartyEnding);
  const shouldFadeTrailingSteps = items.length > 2;

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
            progressRatio={progressRatio}
          />
        ))}
      </div>
    </div>
  );
}
