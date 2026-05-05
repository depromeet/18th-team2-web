import type { InputHTMLAttributes, ReactNode } from 'react';

import { Caption, L2 } from '@/components/ui/Typography';

export type TextInputStatus = 'normal' | 'active' | 'positive' | 'negative' | 'disabled';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'disabled'> {
  label?: string;
  status?: TextInputStatus;
  helperText?: string;
  counter?: { current: number; max: number };
  rightSlot?: ReactNode;
}

const borderStyles: Record<TextInputStatus, string> = {
  normal: 'border-grey-100',
  active: 'border-blue-500',
  positive: 'border-blue-500',
  negative: 'border-red-500',
  disabled: 'border-grey-100 bg-grey-50',
};

function CheckIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500">
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" aria-hidden>
        <path
          d="M1 3.5L3.8 6L9 1"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ErrorIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
      <svg width="2" height="8" viewBox="0 0 2 8" fill="none" aria-hidden>
        <path d="M1 1V4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="1" cy="6.75" r="0.75" fill="white" />
      </svg>
    </span>
  );
}

export function TextInput({
  label,
  status = 'normal',
  helperText,
  counter,
  rightSlot,
  className,
  ...inputProps
}: TextInputProps) {
  const isDisabled = status === 'disabled';
  const showHelperRow = helperText !== undefined || counter !== undefined;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <L2 as="label" className="font-semibold text-black">
          {label}
        </L2>
      )}

      <div
        className={`flex h-12 items-center gap-2 rounded-btn-md border px-3 ${borderStyles[status]} ${isDisabled ? 'opacity-50' : ''}`}
      >
        <input
          {...inputProps}
          disabled={isDisabled}
          className={`w-full bg-transparent text-body-1 font-semibold text-black outline-none placeholder:font-normal placeholder:text-grey-300 ${className ?? ''}`}
        />

        {status === 'positive' && !rightSlot && <CheckIcon />}
        {status === 'negative' && !rightSlot && <ErrorIcon />}
        {rightSlot}
      </div>

      {showHelperRow && (
        <div className="flex items-center justify-between gap-2">
          {helperText !== undefined ? (
            <Caption
              as="p"
              className={status === 'negative' ? 'text-red-500' : 'text-grey-500'}
            >
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
                    ? counter.current >= counter.max
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
      )}
    </div>
  );
}
