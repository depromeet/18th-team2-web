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
 */
export function useInfiniteScroll<T extends HTMLElement>({
  hasNextPage,
  isFetching,
  onLoadMore,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<T>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetching) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, isFetching, onLoadMore]);

  return sentinelRef;
}
