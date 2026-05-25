import { useState, type ChangeEventHandler, type FocusEventHandler } from 'react';

import { Input, type InputProps } from '@/components/ui/Input';
import { NICKNAME_MAX_LENGTH, VALIDATION_MESSAGES } from '@/constants/validation';
import { getGraphemeLength, truncateByGrapheme } from '@/utils/text';

interface NicknameInputProps extends Omit<InputProps, 'maxLength' | 'message' | 'onChange'> {
  message?: string;
  maxLength?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export function NicknameInput({
  value,
  message,
  maxLength = NICKNAME_MAX_LENGTH,
  error,
  onChange,
  onFocus,
  onBlur,
  ...props
}: NicknameInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const helperMessage = message ?? (isFocused ? VALIDATION_MESSAGES.nickname.maxHint : undefined);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (getGraphemeLength(event.target.value) > maxLength) {
      event.target.value = truncateByGrapheme(event.target.value, maxLength);
    }
    onChange?.(event);
  };

  const handleFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <Input
      value={value}
      maxLength={maxLength}
      error={error}
      message={helperMessage}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
}
