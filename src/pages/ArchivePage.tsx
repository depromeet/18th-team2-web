import { useState } from 'react';

import { ArchiveFilterToggle } from '@/components/archive/ArchiveFilterToggle';
import { ArchiveStampCard } from '@/components/archive/ArchiveStampCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { PARTY_ROLE } from '@/constants/party';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useArchiveList } from '@/services/archive';

export default function ArchivePage() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useArchiveList();
  const [mineOnly, setMineOnly] = useState(false);

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

  // "내가 만든 파티" 필터는 클라이언트 측 — cursor 무한스크롤 특성상 로드된 페이지 내에서만 거른다.
  // (정확한 전체 카운트가 필요해지면 BE 필터 파라미터로 전환 권장. 현재 보관함 규모에선 충분.)
  // 헤더 카운트는 디자인대로 필터와 무관하게 항상 전체(totalCount)를 표시한다.
  const items = mineOnly ? data.items.filter((item) => item.role === PARTY_ROLE.HOST) : data.items;

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <PageHeader title={`보관함 ${data.totalCount}개`} />

      <div className="flex h-8 items-center justify-end px-4">
        <ArchiveFilterToggle checked={mineOnly} onChange={setMineOnly} />
      </div>

      <ul className="flex flex-col gap-2 px-4 pt-3 pb-4">
        {items.map((item) => (
          <li key={item.id}>
            <ArchiveStampCard item={item} />
          </li>
        ))}
      </ul>

      {/* 필터 OFF일 때만 추가 로드 (필터 ON 상태의 페이지네이션은 BE 파라미터 도입 시 정교화) */}
      {!mineOnly && hasNextPage ? <div ref={sentinelRef} aria-hidden className="h-px" /> : null}
    </div>
  );
}
