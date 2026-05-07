import { Caption } from '@/components/ui/Typography';

interface InputCounter {
  current: number;
  max: number;
}

interface InputMetaRowProps {
  helperText?: string;
  isError?: boolean;
  counter?: InputCounter;
}

export function InputMetaRow({ helperText, isError = false, counter }: InputMetaRowProps) {
  if (helperText === undefined && counter === undefined) return null;

  return (
    <div className="flex items-center justify-between gap-2">
      {helperText !== undefined ? (
        <Caption as="p" className={isError ? 'text-red-500' : 'text-grey-500'}>
          {helperText}
        </Caption>
      ) : (
        <span />
      )}
      {counter !== undefined && (
        <Caption className="shrink-0 text-grey-300">
          <span
            className={
              counter.current > 0
                ? counter.current > counter.max
                  ? 'font-medium text-red-500'
                  : 'font-medium text-grey-500'
                : ''
            }
          >
            {counter.current}
          </span>
          /{counter.max}
        </Caption>
      )}
    </div>
  );
}
