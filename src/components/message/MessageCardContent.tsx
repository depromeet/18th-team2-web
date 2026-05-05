import { B1, H2 } from '@/components/ui/Typography';

interface Props {
  content: string;
  writerName: string;
}

export function MessageCardContent({ content, writerName }: Props) {
  return (
    <div className="flex h-63 flex-col gap-3 rounded-[20px] bg-white p-6">
      <H2 className="flex-1 overflow-y-auto font-semibold tracking-tight text-blue-600 opacity-90">
        {content}
      </H2>
      <B1 className="text-grey-700 text-right font-semibold">- {writerName}</B1>
    </div>
  );
}
