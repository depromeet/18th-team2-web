import type { ReactNode } from 'react';
import { B1, H2 } from '@/components/ui/Typography';

interface InvitationCardProps {
  title: string;
  children: ReactNode;
  footerDate: string;
}

export function InvitationCard({ title, children, footerDate }: InvitationCardProps) {
  return (
    <div className="relative flex min-h-[446px] w-[343px] flex-col gap-6 rounded-lg bg-white px-7.5 pt-7.5 pb-17.5 shadow-[0px_0px_8px_0px_#5892FF4D]">
      <H2 className="text-grey-500 text-center tracking-[-0.0001em]">{title}</H2>
      <div className="border-grey-50 border-t" />
      <div className="flex-1">{children}</div>
      <div className="border-grey-50 absolute right-7.5 bottom-20 left-7.5 border-t" />
      <B1 as="span" className="text-grey-200 absolute right-7.5 bottom-10.5 left-7.5 font-medium">
        {footerDate}
      </B1>
    </div>
  );
}
