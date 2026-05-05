import { ArchiveStampCard } from '@/components/archive/ArchiveStampCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { useArchiveList } from '@/services/archive';

export default function ArchivePage() {
  const { data } = useArchiveList();
  const items = data ?? [];

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <PageHeader title={`보관함 ${items.length}개`} />

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
