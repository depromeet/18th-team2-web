import type { ReactNode } from 'react';
import { B1, H2 } from '@/components/ui/Typography';

interface InvitationCardProps {
  title: string;
  children: ReactNode;
  footerDate: string;
}

export function InvitationCard({ title, children, footerDate }: InvitationCardProps) {
  return (
    <div
      className="relative flex w-[343px] flex-col gap-6 rounded-[8px] bg-white"
      style={{
        minHeight: 446,
        padding: '30px 30px 70px 30px',
        boxShadow: '0px 0px 8px 0px #5892FF4D',
      }}
    >
      <H2 className="text-grey-500 text-center tracking-[-0.0001em]">{title}</H2>
      <div className="border-grey-50 border-t" />
      <div className="flex-1">{children}</div>
      <div className="border-grey-50 absolute right-[30px] bottom-[80px] left-[30px] border-t" />
      <B1
        as="span"
        className="text-grey-200 absolute right-[30px] bottom-[42px] left-[30px] font-medium"
      >
        {footerDate}
      </B1>
    </div>
  );
}
