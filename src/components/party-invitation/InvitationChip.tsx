import type { ReactNode } from 'react';

import { H1 } from '@/components/ui/Typography';

interface InvitationChipProps {
  children: ReactNode;
}

export function InvitationChip({ children }: InvitationChipProps) {
  return (
    <H1 as="span" className="text-center font-bold tracking-[-0.0044px] text-blue-500">
      {children}
    </H1>
  );
}
