import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  /** 다음 페이지 존재 여부 */
  hasNextPage: boolean;
  /** 페이지 요청 진행 중 여부 (중복 호출 방지) */
  isFetching: boolean;
  /** 센티넬이 뷰포트에 들어왔을 때 호출 */
  onLoadMore: () => void;
}

/**
 * 리스트 끝의 센티넬 엘리먼트가 보이면 다음 페이지를 불러온다.
 * 반환한 ref를 리스트 하단 엘리먼트에 연결해 사용한다.
 *
 * `onLoadMore`/`isFetching`은 ref로 최신 값을 참조하므로,
 * observer는 `hasNextPage` 변화에만 재구독된다.
 */
export function useInfiniteScroll<T extends HTMLElement>({
  hasNextPage,
  isFetching,
  onLoadMore,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<T>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const isFetchingRef = useRef(isFetching);
  onLoadMoreRef.current = onLoadMore;
  isFetchingRef.current = isFetching;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingRef.current) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage]);

  return sentinelRef;
}
