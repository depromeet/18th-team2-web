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
 * fetch 완료(`isFetching` false 전환) 시 observer를 재구독한다 — IO는 교차 상태가
 * 변할 때만 발화하므로, 로드된 페이지가 화면에 항목을 추가하지 못해(예: 클라이언트
 * 필터로 전부 걸러짐) 센티넬이 교차 중인 채 남으면 재구독의 초기 콜백으로 이어서
 * 로드한다. fetch 시작 시점 재구독은 `isFetchingRef` 가드로 no-op.
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
  }, [hasNextPage, isFetching]);

  return sentinelRef;
}
