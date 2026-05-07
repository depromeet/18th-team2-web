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
  const [isOverLimit, setIsOverLimit] = useState(false);
  const helperMessage =
    message ??
    (isOverLimit
      ? VALIDATION_MESSAGES.nickname.invalidFormat
      : isFocused
        ? VALIDATION_MESSAGES.nickname.maxHint
        : undefined);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const isOver = getGraphemeLength(event.target.value) > maxLength;
    if (isOver) event.target.value = truncateByGrapheme(event.target.value, maxLength);
    setIsOverLimit(isOver);
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
      error={error || isOverLimit}
      message={helperMessage}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
}
