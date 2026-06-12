import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ArchivePage from '@/pages/ArchivePage';
import { useArchiveList } from '@/services/archive';
import type { ArchiveListItem } from '@/types/archive';

vi.mock('@/services/archive', () => ({
  useArchiveList: vi.fn(),
}));

// vitest 파이프라인에 svgr 미설정 — svg?react가 컴포넌트로 변환되지 않아 모킹
vi.mock('@/components/ui/icons/ChevronLeftIcon', () => ({
  ChevronLeftIcon: () => null,
}));

// jsdom에는 IntersectionObserver가 없어 no-op 스텁 (페이지 테스트에선 발화 불필요)
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

const hostItem: ArchiveListItem = {
  id: '1',
  partyId: '10',
  type: 'PARTY',
  title: '김루카의 파티',
  date: '26.05.12',
  role: 'HOST',
};

const participantItem: ArchiveListItem = {
  id: '2',
  partyId: '20',
  type: 'PAPER',
  title: '이도현의 롤링페이퍼',
  date: '26.05.13',
  role: 'PARTICIPANT',
};

interface MockArchiveListOptions {
  items?: ArchiveListItem[];
  totalCount?: number;
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

function mockArchiveList({
  items = [],
  totalCount = items.length,
  isLoading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
}: MockArchiveListOptions = {}) {
  vi.mocked(useArchiveList).mockReturnValue({
    data: isLoading ? undefined : { items, totalCount },
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: vi.fn(),
  } as unknown as ReturnType<typeof useArchiveList>);
}

function renderArchivePage() {
  return render(
    <MemoryRouter>
      <ArchivePage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.mocked(useArchiveList).mockReset();
});

describe('ArchivePage', () => {
  it('전체 목록과 헤더 totalCount를 렌더한다', () => {
    mockArchiveList({ items: [hostItem, participantItem], totalCount: 37 });

    renderArchivePage();

    expect(screen.getByRole('heading', { name: '보관함 37개' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '김루카의 파티 26.05.12' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '이도현의 롤링페이퍼 26.05.13' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: '내가 만든 파티' })).not.toBeChecked();
  });

  it('로딩 중에는 헤더만 렌더한다', () => {
    mockArchiveList({ isLoading: true });

    renderArchivePage();

    expect(screen.getByRole('heading', { name: '보관함' })).toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  it('"내가 만든 파티" 토글 ON 시 HOST 항목만 표시하고 헤더 카운트는 유지한다', async () => {
    const user = userEvent.setup();
    mockArchiveList({ items: [hostItem, participantItem], totalCount: 37 });

    renderArchivePage();

    await user.click(screen.getByRole('switch', { name: '내가 만든 파티' }));

    expect(screen.getByRole('switch', { name: '내가 만든 파티' })).toBeChecked();
    expect(screen.getByRole('button', { name: '김루카의 파티 26.05.12' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '이도현의 롤링페이퍼 26.05.13' }),
    ).not.toBeInTheDocument();
    // 헤더 카운트는 필터와 무관하게 전체 totalCount 유지
    expect(screen.getByRole('heading', { name: '보관함 37개' })).toBeInTheDocument();
  });

  it('필터 ON에서도 hasNextPage면 sentinel을 유지한다', async () => {
    const user = userEvent.setup();
    mockArchiveList({ items: [hostItem, participantItem], hasNextPage: true });

    // sentinel은 aria-hidden·텍스트 없음 → role/text 쿼리 불가, 클래스 셀렉터 사용
    const { container } = renderArchivePage();
    const sentinelSelector = 'div.h-px[aria-hidden]';
    expect(container.querySelector(sentinelSelector)).not.toBeNull();

    await user.click(screen.getByRole('switch', { name: '내가 만든 파티' }));

    expect(container.querySelector(sentinelSelector)).not.toBeNull();
  });

  it('hasNextPage가 false면 sentinel을 렌더하지 않는다', () => {
    mockArchiveList({ items: [hostItem], hasNextPage: false });

    const { container } = renderArchivePage();

    expect(container.querySelector('div.h-px[aria-hidden]')).toBeNull();
  });
});
