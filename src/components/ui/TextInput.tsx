import type { InputHTMLAttributes, ReactNode } from 'react';

import RedErrorIcon from '@/assets/icons/icon-red-error.svg?react';
import CheckCircleFilledIcon from '@/assets/images/icons/check-circle-filled.svg?react';
import { InputMetaRow } from '@/components/ui/InputMetaRow';
import { L2 } from '@/components/ui/Typography';

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
  positive: 'border-grey-100',
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

        {status === 'positive' && !rightSlot && <CheckCircleFilledIcon width={20} height={20} />}
        {status === 'negative' && !rightSlot && <RedErrorIcon width={20} height={20} />}
        {rightSlot}
      </div>

      <InputMetaRow helperText={helperText} isError={status === 'negative'} counter={counter} />
    </div>
  );
}
