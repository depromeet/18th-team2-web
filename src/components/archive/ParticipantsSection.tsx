import { B1, L2 } from '@/components/ui/Typography';

interface ParticipantsSectionProps {
  count: number;
  participants: string[];
}

export function ParticipantsSection({ count, participants }: ParticipantsSectionProps) {
  return (
    <section className="flex flex-col gap-2 px-4 py-3">
      <div className="flex items-center gap-1">
        <B1 className="font-semibold text-black">참여자</B1>
        <B1 className="font-semibold text-black">{count}명</B1>
      </div>
      <L2 className="text-grey-500">{participants.join(', ')}</L2>
    </section>
  );
}
