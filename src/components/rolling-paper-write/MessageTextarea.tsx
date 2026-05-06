import type { ControllerRenderProps } from 'react-hook-form';

import {
  MAX_MESSAGE_LENGTH,
  type RollingPaperWriteFormValues,
} from '@/components/rolling-paper-write/useRollingPaperWriteForm';
import { InputMetaRow } from '@/components/ui/InputMetaRow';
import { useControlledGraphemeLimitedField } from '@/hooks/useGraphemeLimitedField';
import { getGraphemeLength } from '@/utils/text';

interface MessageTextareaProps {
  field: ControllerRenderProps<RollingPaperWriteFormValues, 'message'>;
}

export function MessageTextarea({ field }: MessageTextareaProps) {
  const message = field.value ?? '';
  const charCount = getGraphemeLength(message);
  const { field: limitedField, overLimitMessage } = useControlledGraphemeLimitedField(field, {
    max: MAX_MESSAGE_LENGTH,
    message: `${MAX_MESSAGE_LENGTH}자 이하로 입력해주세요`,
  });

  return (
    <>
      <div className="flex flex-col rounded-[20px] bg-white px-6 py-6">
        <textarea
          {...limitedField}
          rows={6}
          value={message}
          placeholder="태어나줘서 고마워 ♥"
          className="placeholder:text-grey-200 w-full resize-none bg-transparent text-[20px] leading-[1.4] font-semibold text-blue-600 outline-none placeholder:font-semibold"
        />
      </div>
      <InputMetaRow
        helperText={overLimitMessage ?? undefined}
        isError={!!overLimitMessage}
        counter={{ current: charCount, max: MAX_MESSAGE_LENGTH }}
      />
    </>
  );
}
