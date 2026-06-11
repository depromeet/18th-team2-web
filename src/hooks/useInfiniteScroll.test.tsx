import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

type IOCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

// jsdom에는 IntersectionObserver가 없어 직접 스텁한다.
// 실제 IO처럼 observe() 직후 현재 교차 상태로 초기 콜백을 발화한다 —
// "fetch 완료 후 재구독 초기 콜백으로 연쇄 로드" 시나리오 검증에 필요.
let isSentinelIntersecting = false;
const observers: MockIntersectionObserver[] = [];

class MockIntersectionObserver {
  private readonly callback: IOCallback;
  readonly observed = new Set<Element>();

  constructor(callback: IOCallback) {
    this.callback = callback;
    observers.push(this);
  }

  observe(element: Element) {
    this.observed.add(element);
    this.emit();
  }

  unobserve(element: Element) {
    this.observed.delete(element);
  }

  disconnect() {
    this.observed.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  emit() {
    this.callback(
      [{ isIntersecting: isSentinelIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

/** 교차 상태를 바꾸고 활성(구독 중) observer에 콜백을 발화한다 */
function setIntersecting(value: boolean) {
  isSentinelIntersecting = value;
  for (const observer of observers) {
    if (observer.observed.size > 0) observer.emit();
  }
}

/** 현재 엘리먼트를 구독 중인 observer 수 */
function activeObserverCount() {
  return observers.filter((observer) => observer.observed.size > 0).length;
}

interface SentinelProps {
  hasNextPage: boolean;
  isFetching: boolean;
  onLoadMore: () => void;
}

function Sentinel({ hasNextPage, isFetching, onLoadMore }: SentinelProps) {
  const ref = useInfiniteScroll<HTMLDivElement>({ hasNextPage, isFetching, onLoadMore });
  return <div ref={ref} data-testid="sentinel" />;
}

beforeEach(() => {
  isSentinelIntersecting = false;
  observers.length = 0;
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useInfiniteScroll', () => {
  it('센티넬이 교차하고 isFetching이 아니면 onLoadMore를 호출한다', () => {
    const onLoadMore = vi.fn();
    render(<Sentinel hasNextPage isFetching={false} onLoadMore={onLoadMore} />);

    expect(onLoadMore).not.toHaveBeenCalled();

    act(() => setIntersecting(true));

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('isFetching 중에는 교차해도 onLoadMore를 호출하지 않는다', () => {
    const onLoadMore = vi.fn();
    render(<Sentinel hasNextPage isFetching onLoadMore={onLoadMore} />);

    act(() => setIntersecting(true));

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('fetch 완료 시 재구독 초기 콜백으로 교차 중인 센티넬을 이어서 로드한다', () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(
      <Sentinel hasNextPage isFetching={false} onLoadMore={onLoadMore} />,
    );

    // 1) 교차 → 첫 로드
    act(() => setIntersecting(true));
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    // 2) fetch 시작 — 재구독 초기 콜백은 isFetching 가드로 no-op
    rerender(<Sentinel hasNextPage isFetching onLoadMore={onLoadMore} />);
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    // 3) fetch 완료 — 재구독 초기 콜백이 교차 중인 센티넬을 감지해 연쇄 로드
    rerender(<Sentinel hasNextPage isFetching={false} onLoadMore={onLoadMore} />);
    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });

  it('hasNextPage가 false면 observer를 구독하지 않는다', () => {
    const onLoadMore = vi.fn();
    render(<Sentinel hasNextPage={false} isFetching={false} onLoadMore={onLoadMore} />);

    expect(activeObserverCount()).toBe(0);

    act(() => setIntersecting(true));

    expect(onLoadMore).not.toHaveBeenCalled();
  });
});
