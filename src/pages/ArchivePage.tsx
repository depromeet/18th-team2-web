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

  // "내가 만든 파티" 필터는 클라이언트 측 — 스크롤로 페이지를 계속 로드하며 로드분에서 거른다.
  // (BE 필터 파라미터 도입 시 서버 필터로 전환 권장. 현재 보관함 규모에선 충분.)
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

      {/* 필터 ON에서도 sentinel 유지 — 걸러진 항목이 적으면 sentinel이 바로 노출돼
          미로드 페이지를 이어서 로드한다(클라이언트 필터의 HOST 누락 방지). */}
      {hasNextPage ? <div ref={sentinelRef} aria-hidden className="h-px" /> : null}
    </div>
  );
}
