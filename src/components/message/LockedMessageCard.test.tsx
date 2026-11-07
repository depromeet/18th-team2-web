import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LockedMessageCard } from '@/components/message/LockedMessageCard';

vi.mock('@/assets/images/icons/close.svg?react', () => ({
  default: () => <svg aria-hidden="true" />,
}));

afterEach(() => {
  vi.useRealTimers();
});

describe('LockedMessageCard', () => {
  it('모달을 연 현재 시각부터 공개 시각까지 남은 시간을 표시한다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-29T09:25:00+09:00'));

    render(
      <LockedMessageCard
        messages={[{ id: '1', writerNickname: '해파링링', toppingType: 'cherry' }]}
        initialIndex={0}
        viewableAt="2026-10-30T22:00:00+09:00"
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: '롤링페이퍼 공개 안내' })).toBeInTheDocument();
    expect(screen.getByText('1일 12시간 35분 남았어요')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByRole('progressbar')).toHaveClass('rolling-paper-lock-progress');
  });

  it('닫기 버튼을 누르면 모달을 닫는다', () => {
    const onClose = vi.fn();

    render(
      <LockedMessageCard
        messages={[{ id: '1', writerNickname: '해파링링', toppingType: 'cherry' }]}
        initialIndex={0}
        viewableAt="2099-10-30T22:00:00+09:00"
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '메시지 닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('공개 시각이 되면 목록 갱신 콜백을 호출한다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-30T21:59:59+09:00'));
    const onViewable = vi.fn();

    render(
      <LockedMessageCard
        messages={[{ id: '1', writerNickname: '해파링링', toppingType: 'cherry' }]}
        initialIndex={0}
        viewableAt="2026-10-30T22:00:00+09:00"
        onClose={vi.fn()}
        onViewable={onViewable}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onViewable).toHaveBeenCalledTimes(1);
  });
});
