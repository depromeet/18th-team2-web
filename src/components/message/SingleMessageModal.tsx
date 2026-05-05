import { MessageCardContent } from '@/components/message/MessageCardContent';
import { MessageCloseButton } from '@/components/message/MessageCloseButton';

interface Props {
  content: string;
  writerName: string;
  onClose: () => void;
}

export function SingleMessageModal({ content, writerName, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute top-1/2 left-1/2 flex w-full max-w-107.5 -translate-x-1/2 -translate-y-1/2 flex-col items-end gap-3 pr-1">
        <MessageCloseButton onClick={onClose} />
        <div className="w-full px-7.5">
          <MessageCardContent content={content} writerName={writerName} />
        </div>
      </div>
    </div>
  );
}
