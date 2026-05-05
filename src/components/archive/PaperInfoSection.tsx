import { H2, L1 } from '@/components/ui/Typography';

interface Props {
  title: string;
  startDate: string;
  endDate: string;
}

export function PaperInfoSection({ title, startDate, endDate }: Props) {
  return (
    <section className="flex flex-col gap-2 px-4 py-3">
      <H2 as="h2" className="text-black">
        {title}
      </H2>
      <L1 className="text-grey-500">
        {startDate} - {endDate}
      </L1>
    </section>
  );
}
