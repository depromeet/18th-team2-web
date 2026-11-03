import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RollingPaperInviteView } from '@/components/rolling-paper/RollingPaperInviteView';

const { mockNavigate, mockRefetch, mockUseRollingPaper } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockRefetch: vi.fn(),
  mockUseRollingPaper: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/invite/test-token' }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/services/rolling-paper', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('@/services/rolling-paper');
  return {
    ...actual,
    useRollingPaper: mockUseRollingPaper,
  };
});

vi.mock('@/components/ui/icons/ChevronLeftIcon', () => ({
  ChevronLeftIcon: () => <svg aria-hidden="true" />,
}));

vi.mock('@/components/ui/icons/RefreshIcon', () => ({
  RefreshIcon: () => <svg aria-hidden="true" />,
}));

describe('RollingPaperInviteView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('편지가 없는 참가자에게 작성 안내만 표시하고 공유 기능은 노출하지 않는다', () => {
    mockUseRollingPaper.mockReturnValue({
      data: { partyId: '1', messages: [], totalCount: 0 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(
      <RollingPaperInviteView
        partyId="1"
        inviteToken="test-token"
        hostName="김이라"
        writableUntil="2099-10-30T22:00:00+09:00"
      />,
    );

    expect(screen.getByText(/김이라님을 위해/)).toHaveTextContent(
      '김이라님을 위해롤링페이퍼를 작성해 주세요!',
    );
    expect(screen.getByText('가장 처음으로 마음을 남겨보세요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '롤링페이퍼 남기기' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '공유하기' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('편지가 있으면 기존 참가자 문구와 비활성 토핑을 유지한다', () => {
    mockUseRollingPaper.mockReturnValue({
      data: {
        partyId: '1',
        messages: [{ id: '1', writerNickname: '해파링링', toppingType: 'cherry' }],
        totalCount: 1,
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(
      <RollingPaperInviteView
        partyId="1"
        inviteToken="test-token"
        hostName="김이라"
        writableUntil="2099-10-30T22:00:00+09:00"
      />,
    );

    expect(screen.getByText('김이라님의 롤링페이퍼')).toBeInTheDocument();
    expect(screen.getByText(/롤링페이퍼로 축하를 남겨보세요!/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /해파링링/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.queryByRole('button', { name: '공유하기' })).not.toBeInTheDocument();
  });
});
