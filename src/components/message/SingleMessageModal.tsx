import { MessageCardBox } from '@/components/message/MessageCardBox';
import { MessageCloseButton } from '@/components/message/MessageCloseButton';
import { B1, H2 } from '@/components/ui/Typography';

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
      <div className="absolute top-1/2 left-1/2 flex w-full max-w-107.5 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
        <div className="flex w-full justify-end pr-1">
          <MessageCloseButton onClick={onClose} />
        </div>
        <div className="w-full px-7.5">
          <MessageCardBox>
            <H2 className="min-h-0 flex-1 overflow-y-auto font-semibold tracking-tight text-blue-600 opacity-90">
              {content}
            </H2>
          </MessageCardBox>
        </div>
        <B1 className="text-center font-semibold text-white">{writerName}</B1>
      </div>
    </div>
  );
}
