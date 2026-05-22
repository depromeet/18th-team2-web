import { ArchiveStampCard } from '@/components/archive/ArchiveStampCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useArchiveList } from '@/services/archive';

export default function ArchivePage() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useArchiveList();

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    hasNextPage: hasNextPage ?? false,
    isFetching: isFetchingNextPage,
    onLoadMore: () => {
      fetchNextPage();
    },
  });

  if (isLoading || !data) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <PageHeader title="보관함" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <PageHeader title={`보관함 ${data.totalCount}개`} />

      <ul className="flex flex-col gap-2 px-4 pt-3 pb-4">
        {data.items.map((item) => (
          <li key={item.id}>
            <ArchiveStampCard item={item} />
          </li>
        ))}
      </ul>

      {hasNextPage ? <div ref={sentinelRef} aria-hidden className="h-px" /> : null}
    </div>
  );
}
