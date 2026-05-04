import type { ReactNode } from 'react';

import { H2 } from '@/components/ui/Typography';

interface InvitationChipProps {
  children: ReactNode;
}

export function InvitationChip({ children }: InvitationChipProps) {
  return (
    <H2 as="span" className="rounded-[40px] bg-blue-50 px-3 py-1 text-blue-500">
      {children}
    </H2>
  );
}
