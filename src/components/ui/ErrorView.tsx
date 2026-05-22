import { Button } from '@/components/ui/Button';
import { AlertIcon } from '@/components/ui/icons/AlertIcon';
import { B1, H2 } from '@/components/ui/Typography';

type ErrorViewVariant = 'retry' | 'notFound';

interface ErrorViewProps {
  variant?: ErrorViewVariant;
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
}

const ERROR_VIEW_COPY = {
  retry: {
    title: '오류가 발생했어요',
    description: '잠시 후 다시 시도해주세요.',
    primaryLabel: '다시시도하기',
    secondaryLabel: '이전으로',
  },
  notFound: {
    title: '화면을 불러오지 못했어요',
    description: '화면이 존재하지 않거나,\n사용할 수 없는 화면이에요.',
    primaryLabel: '홈으로',
  },
} as const;

export function ErrorView({
  variant = 'retry',
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
  className,
}: ErrorViewProps) {
  const copy = ERROR_VIEW_COPY[variant];
  const resolvedTitle = title ?? copy.title;
  const resolvedDescription = description ?? copy.description;
  const resolvedPrimaryLabel = primaryLabel ?? copy.primaryLabel;
  const resolvedSecondaryLabel =
    secondaryLabel ?? ('secondaryLabel' in copy ? copy.secondaryLabel : undefined);

  return (
    <main
      className={`bg-grey-30 mx-auto flex min-h-dvh w-full max-w-150 flex-col px-4 pb-[calc(24px+env(safe-area-inset-bottom))] ${className ?? ''}`}
    >
      <section className="flex flex-1 flex-col items-center pt-[24.6vh] text-center">
        <AlertIcon width={72} height={72} aria-hidden="true" />

        <H2 as="h1" className="text-grey-900 mt-6">
          {resolvedTitle}
        </H2>

        <B1 className="text-grey-400 mt-5 whitespace-pre-line font-medium">
          {resolvedDescription}
        </B1>
      </section>

      <div className="flex flex-col items-center gap-4">
        <Button type="button" onClick={onPrimaryClick}>
          {resolvedPrimaryLabel}
        </Button>

        {resolvedSecondaryLabel && (
          <button
            type="button"
            className="text-label-1 cursor-pointer font-semibold text-blue-600 underline underline-offset-2"
            onClick={onSecondaryClick}
          >
            {resolvedSecondaryLabel}
          </button>
        )}
      </div>
    </main>
  );
}
