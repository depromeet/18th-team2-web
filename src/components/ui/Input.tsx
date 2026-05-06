import { type InputHTMLAttributes, useId } from 'react';

import { CheckCircleFilledIcon } from '@/components/ui/icons/CheckCircleFilledIcon';
import { ErrorCircleFilledIcon } from '@/components/ui/icons/ErrorCircleFilledIcon';
import { InputMetaRow } from '@/components/ui/InputMetaRow';
import { getGraphemeLength } from '@/utils/text';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'maxLength'> {
  value: string;
  message?: string;
  maxLength?: number;
  error?: boolean;
}

export function Input({
  value,
  message,
  maxLength,
  error = false,
  className,
  disabled,
  ...props
}: InputProps) {
  const id = useId();

  const hasValue = value.length > 0;
  const isSuccess = !error && hasValue;

  const borderClass = error ? 'border-red-500' : 'border-grey-100 focus-within:border-blue-600';

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          id={id}
          value={value}
          disabled={disabled}
          className={`text-body-1 rounded-btn-md placeholder:text-grey-300 w-full border bg-white px-4 py-3 font-semibold shadow-xs outline-none placeholder:font-normal disabled:bg-black/5 disabled:opacity-50 ${borderClass} ${className ?? ''}`}
          {...props}
        />
        {!disabled && (isSuccess || error) && (
          <span className="absolute top-1/2 right-4 -translate-y-1/2">
            {error ? (
              <ErrorCircleFilledIcon className="h-5 w-5" />
            ) : (
              <CheckCircleFilledIcon className="h-5 w-5" />
            )}
          </span>
        )}
      </div>

      <InputMetaRow
        helperText={message}
        isError={error}
        counter={
          !disabled && maxLength !== undefined
            ? { current: getGraphemeLength(value), max: maxLength }
            : undefined
        }
      />
    </div>
  );
}
