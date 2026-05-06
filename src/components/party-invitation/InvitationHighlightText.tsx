import type { ReactNode } from 'react';

import { H1 } from '@/components/ui/Typography';

interface InvitationHighlightTextProps {
  children: ReactNode;
}

export function InvitationHighlightText({ children }: InvitationHighlightTextProps) {
  return (
    <H1 as="span" className="font-bold tracking-[-0.0044px] text-blue-500">
      {children}
    </H1>
  );
}
