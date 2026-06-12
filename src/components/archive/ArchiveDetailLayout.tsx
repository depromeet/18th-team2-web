import type { ReactNode } from 'react';

import { StampHeroCard } from '@/components/archive/StampHeroCard';
import { PageHeader } from '@/components/ui/PageHeader';

interface ArchiveDetailLayoutProps {
  title: string;
  id: string;
  children: ReactNode;
}

export function ArchiveDetailLayout({ title, id, children }: ArchiveDetailLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-white pb-4">
      <PageHeader title={title} />
      <StampHeroCard id={id} />
      {children}
    </div>
  );
}
