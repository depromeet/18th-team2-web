import type { ControllerRenderProps } from 'react-hook-form';

import type { RollingPaperWriteFormValues } from '@/components/rolling-paper-write/useRollingPaperWriteForm';
import { InputMetaRow } from '@/components/ui/InputMetaRow';
import { MESSAGE_MAX_LENGTH, VALIDATION_MESSAGES } from '@/constants/validation';
import { useControlledGraphemeLimitedField } from '@/hooks/useGraphemeLimitedField';
import { getGraphemeLength } from '@/utils/text';

interface MessageTextareaProps {
  field: ControllerRenderProps<RollingPaperWriteFormValues, 'message'>;
}

export function MessageTextarea({ field }: MessageTextareaProps) {
  const message = field.value ?? '';
  const charCount = getGraphemeLength(message);
  const { field: limitedField, overLimitMessage } = useControlledGraphemeLimitedField(field, {
    max: MESSAGE_MAX_LENGTH,
    message: VALIDATION_MESSAGES.message.maxLength,
  });

  return (
    <>
      <div className="flex h-[240px] flex-col rounded-[20px] bg-white px-6 py-6">
        <textarea
          {...limitedField}
          value={message}
          placeholder="태어나줘서 고마워 ♥"
          className="placeholder:text-grey-200 h-full w-full resize-none bg-transparent text-[20px] leading-[1.4] font-semibold text-blue-600 outline-none placeholder:font-semibold"
        />
      </div>
      <InputMetaRow
        helperText={overLimitMessage ?? undefined}
        isError={!!overLimitMessage}
        counter={{ current: charCount, max: MESSAGE_MAX_LENGTH }}
      />
    </>
  );
}
