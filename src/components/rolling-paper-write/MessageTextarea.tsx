import type { ControllerRenderProps } from 'react-hook-form';

import {
  MAX_MESSAGE_LENGTH,
  type RollingPaperWriteFormValues,
} from '@/components/rolling-paper-write/useRollingPaperWriteForm';
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
      <div className="flex items-center justify-between gap-2 text-[14px] leading-5">
        {overLimitMessage ? (
          <p className="text-[12px] leading-4 text-red-500">{overLimitMessage}</p>
        ) : (
          <span />
        )}
        <div className="flex gap-0.5">
          <span
            className={`font-medium ${
              charCount > MAX_MESSAGE_LENGTH ? 'text-red-500' : 'text-grey-500'
            }`}
          >
            {charCount}
          </span>
          <span className="text-grey-300 font-normal">/</span>
          <span className="text-grey-300 font-normal">{MAX_MESSAGE_LENGTH}</span>
        </div>
      </div>
    </>
  );
}
