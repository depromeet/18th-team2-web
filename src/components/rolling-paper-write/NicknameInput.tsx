import type { ControllerRenderProps } from 'react-hook-form';

import type { RollingPaperWriteFormValues } from '@/components/rolling-paper-write/useRollingPaperWriteForm';
import { Input } from '@/components/ui/Input';
import { NICKNAME_MAX_LENGTH } from '@/constants/validation';

interface NicknameInputProps {
  field: ControllerRenderProps<RollingPaperWriteFormValues, 'nickname'>;
  errorMessage?: string;
}

export function NicknameInput({ field, errorMessage }: NicknameInputProps) {
  return (
    <Input
      {...field}
      value={field.value ?? ''}
      maxLength={NICKNAME_MAX_LENGTH}
      placeholder="이름이나 별명을 입력해주세요"
      autoComplete="off"
      error={!!errorMessage}
      message={errorMessage}
    />
  );
}
