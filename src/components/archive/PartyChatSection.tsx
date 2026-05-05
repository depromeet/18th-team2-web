import { B1, Caption, L1, L2 } from '@/components/ui/Typography';
import type { ChatMessage } from '@/types/archive';

interface PartyChatSectionProps {
  messages: ChatMessage[];
}

export function PartyChatSection({ messages }: PartyChatSectionProps) {
  return (
    <section className="flex flex-col gap-2 px-4 py-3">
      <B1 className="font-semibold text-black">파티 채팅</B1>
      <ul className="flex flex-col gap-1">
        {messages.map((msg) => (
          <li key={msg.id} className="bg-grey-30 flex flex-col gap-2 rounded-[12px] p-2">
            <div className="flex items-center justify-between">
              <L2 className="text-grey-600">@{msg.authorName}</L2>
              <Caption className="text-grey-200">{msg.sentAt}</Caption>
            </div>
            <L1 className="text-grey-800 font-medium">{msg.content}</L1>
          </li>
        ))}
      </ul>
    </section>
  );
}
