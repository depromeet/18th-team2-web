import type { ReactNode } from 'react';

import { StampHeroCard } from '@/components/archive/StampHeroCard';
import { PageHeader } from '@/components/ui/PageHeader';
import type { StampType } from '@/types/archive';

interface ArchiveDetailLayoutProps {
  title: string;
  id: string;
  stamp?: StampType;
  children: ReactNode;
}

export function ArchiveDetailLayout({ title, id, stamp, children }: ArchiveDetailLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-white pb-4">
      <PageHeader title={title} />
      <StampHeroCard id={id} stamp={stamp} />
      {children}
    </div>
  );
}
