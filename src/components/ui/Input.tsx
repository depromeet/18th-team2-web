import { type InputHTMLAttributes, useId } from 'react';
import { L2 } from './Typography';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'maxLength'> {
  value: string;
  message?: string;
  maxLength?: number;
  regex?: RegExp;
  error?: boolean;
}

export function Input({
  value,
  message,
  maxLength,
  regex,
  error = false,
  className,
  disabled,
  ...props
}: InputProps) {
  const id = useId();

  const hasValue = value.length > 0;
  const regexFail = !!regex && hasValue && !regex.test(value);
  const isError = error || regexFail;
  const isSuccess = !error && !!regex && hasValue && regex.test(value);

  const borderClass = isError ? 'border-red-500' : 'border-grey-100 focus:border-blue-600';

  return (
    <div className="flex flex-col">
      <div className="relative">
        <input
          id={id}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          className={`text-body-1 rounded-btn-md placeholder:text-grey-300 w-full border bg-white px-4 py-3 font-semibold shadow-xs outline-none placeholder:font-normal disabled:bg-black/5 disabled:opacity-50 ${borderClass} ${className ?? ''}`}
          {...props}
        />
        {!disabled && (isSuccess || isError) && (
          //TODO: 민수님 아이콘 svg pr merge 이후 수정
          <span
            className={`absolute top-1/2 right-4 size-4 -translate-y-1/2 rounded-full ${isError ? 'bg-red-500' : 'bg-blue-500'}`}
          />
        )}
      </div>

      {(message || maxLength !== undefined) && (
        <div className="mt-2 flex items-center justify-between">
          <L2 className={`font-normal ${isError ? 'text-red-500' : 'text-grey-300'}`} as="p">
            {message}
          </L2>
          {!disabled && maxLength !== undefined && (
            <L2 className="font-normal">
              <span className="text-grey-400">{value.length}</span>
              <span className="text-grey-200">/{maxLength}</span>
            </L2>
          )}
        </div>
      )}
    </div>
  );
}
