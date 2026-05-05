import { Caption, H2, L1 } from '@/components/ui/Typography';
import type { PartyRole } from '@/types/archive';

interface Props {
  partyName: string;
  date: string;
  time: string;
  participantCount: number;
  role: PartyRole;
}

export function PartyInfoSection({ partyName, date, time, participantCount, role }: Props) {
  return (
    <section className="flex flex-col gap-2 px-4 py-3">
      <div className="flex items-center gap-2">
        <H2 as="h2" className="text-black">
          {partyName}
        </H2>
        {role === 'HOST' && (
          <span className="bg-grey-50 inline-flex items-center justify-center rounded-md px-1 py-0.5">
            <Caption className="text-grey-500 font-medium">주최자</Caption>
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <L1 className="text-grey-500">{date}</L1>
        <span className="h-3 w-px bg-black/30" aria-hidden />
        <L1 className="text-grey-500">{time}</L1>
        <span className="h-3 w-px bg-black/30" aria-hidden />
        <L1 className="text-grey-500">{participantCount}명</L1>
      </div>
    </section>
  );
}
