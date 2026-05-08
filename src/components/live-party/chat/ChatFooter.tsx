import { useState } from 'react';
import { FirecrackerButton } from '@/components/live-party/chat/FirecrackerButton';

interface ChatFooterProps {
  onSend: (text: string) => void;
}

export function ChatFooter({ onSend }: ChatFooterProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 py-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="하고 싶은 말을 남겨주세요!"
        className="w-full rounded-[200px] border border-white/60 bg-white/10 px-4 py-2 font-semibold text-white outline-none placeholder:font-normal placeholder:text-gray-300"
      />
      <FirecrackerButton />
    </div>
  );
}
