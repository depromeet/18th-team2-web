import type { ControllerRenderProps } from 'react-hook-form';

import {
  MAX_NICKNAME_LENGTH,
  type RollingPaperWriteFormValues,
} from '@/components/rolling-paper-write/useRollingPaperWriteForm';
import { TextInput } from '@/components/ui/TextInput';
import { useControlledGraphemeLimitedField } from '@/hooks/useGraphemeLimitedField';
import { getGraphemeLength } from '@/utils/text';

interface NicknameInputProps {
  field: ControllerRenderProps<RollingPaperWriteFormValues, 'nickname'>;
  isFocused: boolean;
  errorMessage?: string;
  onFocus: () => void;
  onBlur: () => void;
}

export function NicknameInput({
  field,
  isFocused,
  errorMessage,
  onFocus,
  onBlur,
}: NicknameInputProps) {
  const nickname = field.value ?? '';
  const charCount = getGraphemeLength(nickname);
  const { field: limitedField, overLimitMessage } = useControlledGraphemeLimitedField(field, {
    max: MAX_NICKNAME_LENGTH,
    message: `닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요`,
  });
  const helperText = overLimitMessage ?? errorMessage;
  const isError = !!helperText;
  const inputStatus = isError ? 'negative' : isFocused ? 'active' : charCount > 0 ? 'positive' : 'normal';

  return (
    <TextInput
      {...limitedField}
      value={nickname}
      onFocus={onFocus}
      onBlur={() => {
        onBlur();
        limitedField.onBlur();
      }}
      status={inputStatus}
      placeholder="이름이나 별명을 입력해주세요"
      autoComplete="off"
      helperText={helperText}
      counter={{ current: charCount, max: MAX_NICKNAME_LENGTH }}
    />
  );
}
