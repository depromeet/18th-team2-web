import { useNavigate } from 'react-router-dom';

import { ArchiveStampCard } from '@/components/archive/ArchiveStampCard';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { H3 } from '@/components/ui/Typography';
import { useArchiveList } from '@/services/archive';

export default function ArchivePage() {
  const navigate = useNavigate();
  const { data } = useArchiveList();
  const items = data ?? [];

  return (
    <div className="flex min-h-dvh flex-col bg-white">
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
          보관함 {items.length}개
        </H3>
      </header>

      <ul className="flex flex-col gap-2 px-4 pt-3 pb-4">
        {items.map((item) => (
          <li key={item.id}>
            <ArchiveStampCard item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
