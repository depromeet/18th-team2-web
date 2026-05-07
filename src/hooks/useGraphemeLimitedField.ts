import { useState, type ChangeEvent } from 'react';

import type { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

import { getGraphemeLength, truncateByGrapheme } from '@/utils/text';

interface UseGraphemeLimitedFieldOptions {
  max: number;
  message: string;
}

type LimitedFieldElement = HTMLInputElement | HTMLTextAreaElement;

export function useControlledGraphemeLimitedField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  field: ControllerRenderProps<TFieldValues, TName>,
  { max, message }: UseGraphemeLimitedFieldOptions,
) {
  const [overLimitMessage, setOverLimitMessage] = useState<string | null>(null);

  function onChange(e: ChangeEvent<LimitedFieldElement>) {
    const value = e.target.value;

    if (getGraphemeLength(value) > max) {
      const nextValue = truncateByGrapheme(value, max);
      e.target.value = nextValue;
      field.onChange(nextValue);
      setOverLimitMessage(message);
      return;
    }

    field.onChange(value);
    setOverLimitMessage(null);
  }

  return {
    field: { ...field, onChange },
    overLimitMessage,
  };
}
