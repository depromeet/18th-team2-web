import type { InputHTMLAttributes, ReactNode } from 'react';

import blueCheckIcon from '@/assets/icons/icon-blue-check.svg';
import redErrorIcon from '@/assets/icons/icon-red-error.svg';
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

        {status === 'positive' && !rightSlot && (
          <img src={blueCheckIcon} alt="" className="h-5 w-5 shrink-0" />
        )}
        {status === 'negative' && !rightSlot && (
          <img src={redErrorIcon} alt="" className="h-5 w-5 shrink-0" />
        )}
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
