import { FirecrackerButton } from '@/components/live-party/chat/FirecrackerButton';
import { SendButton } from '@/components/live-party/chat/SendButton';
import { useChatFooter } from '@/hooks/live-party/useChatFooter';

interface ChatFooterProps {
  onSend: (text: string) => void;
}

export function ChatFooter({ onSend }: ChatFooterProps) {
  const {
    value,
    setValue,
    isFocused,
    setIsFocused,
    isTyping,
    inputRef,
    handleSend,
    handleKeyDown,
  } = useChatFooter({ onSend });

  return (
    <div className="flex items-center gap-3 pt-2 pb-[calc(16px+env(safe-area-inset-bottom))]">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="하고 싶은 말을 남겨주세요!"
        className={`placeholder:text-grey-300 text-label-1! min-w-0 flex-1 rounded-[200px] bg-white/10 px-4 py-2 font-semibold text-white outline-none placeholder:font-normal ${
          isFocused ? 'border-2 border-blue-600' : 'border border-white'
        }`}
      />
      <div className="flex h-11 w-12.5 shrink-0 items-center justify-center">
        {isTyping ? <SendButton onClick={handleSend} /> : <FirecrackerButton />}
      </div>
    </div>
  );
}
