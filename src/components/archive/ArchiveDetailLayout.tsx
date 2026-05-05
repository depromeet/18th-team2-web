import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { StampHeroCard } from '@/components/archive/StampHeroCard';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { H3 } from '@/components/ui/Typography';
import type { StampType } from '@/types/archive';

interface Props {
  title: string;
  id: string;
  stamp?: StampType;
  children: ReactNode;
}

export function ArchiveDetailLayout({ title, id, stamp, children }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-4">
      <header className="relative flex h-[42px] items-center px-4">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-[9px] flex h-6 w-6 items-center justify-center"
        >
          <ChevronLeftIcon className="text-grey-900" />
        </button>
        <H3 as="h1" className="mx-auto text-grey-900">
          {title}
        </H3>
      </header>

      <StampHeroCard id={id} stamp={stamp} />

      {children}
    </div>
  );
}
