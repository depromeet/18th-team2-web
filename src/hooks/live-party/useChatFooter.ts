import { useRef, useState } from 'react';

interface UseChatFooterOptions {
  onSend: (text: string) => void;
}

export function useChatFooter({ onSend }: UseChatFooterOptions) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isTyping = isFocused || value.length > 0;

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue('');
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSend();
    }
  };

  return {
    value,
    setValue,
    isFocused,
    setIsFocused,
    isTyping,
    inputRef,
    handleSend,
    handleKeyDown,
  };
}
