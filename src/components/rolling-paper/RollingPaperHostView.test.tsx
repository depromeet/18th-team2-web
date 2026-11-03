import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RollingPaperHostView } from '@/components/rolling-paper/RollingPaperHostView';

vi.mock('@/assets/images/icons/close.svg?react', () => ({
  default: () => <svg aria-hidden="true" />,
}));

vi.mock('@/assets/images/icons/download.svg?react', () => ({
  default: () => <svg aria-hidden="true" />,
}));

vi.mock('@/assets/images/icons/party-popper.svg?react', () => ({
  default: () => <svg aria-hidden="true" />,
}));

vi.mock('@/components/ui/icons/ChevronLeftIcon', () => ({
  ChevronLeftIcon: () => <svg aria-hidden="true" />,
}));

vi.mock('@/components/ui/icons/RefreshIcon', () => ({
  RefreshIcon: () => <svg aria-hidden="true" />,
}));

vi.mock('@/components/ui/LinkShareSheet', () => ({
  LinkShareSheet: () => null,
}));

function renderView() {
  const onShareClick = vi.fn();
  const onRefresh = vi.fn();

  render(
    <RollingPaperHostView
      hostName="김이라"
      viewableAt="2099-10-21T22:00:00+09:00"
      writableUntil="2099-10-28T22:00:00+09:00"
      isWritable
      isShareSheetOpen={false}
      inviteShareLink="https://hapalin.com/invite/test"
      isActivatingInvite={false}
      onShareClick={onShareClick}
      onShareSheetClose={vi.fn()}
      onBackClick={vi.fn()}
      onRefresh={onRefresh}
    />,
  );

  return { onRefresh, onShareClick };
}

describe('RollingPaperHostView', () => {
  it('공개 일시와 작성 마감 카운트다운을 표시한다', () => {
    renderView();

    expect(screen.getByText(/김이라님을 위해/)).toHaveTextContent(
      '김이라님을 위해롤링페이퍼를 작성해 주세요!',
    );
    expect(screen.getByText('10월 21일 밤 10시')).toBeInTheDocument();
    expect(screen.queryByText('공개시간이 되면 확인할 수 있어요')).not.toBeInTheDocument();
    expect(screen.getByText(/작성 가능한 시간/)).toBeInTheDocument();
  });

  it('공유 안내는 닫기 전까지 노출되고 X 버튼으로 닫힌다', () => {
    renderView();

    expect(screen.getByRole('status')).toHaveClass('link-share-toast');
    expect(screen.getByText(/친구들에게 공유하면/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '공유 안내 닫기' }));
    expect(screen.queryByText(/친구들에게 공유하면/)).not.toBeInTheDocument();
  });

  it('공유 버튼은 동작하고 다운로드 버튼은 준비 중 상태다', () => {
    const { onShareClick } = renderView();

    fireEvent.click(screen.getByRole('button', { name: '롤링페이퍼 공유하기' }));
    expect(onShareClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '이미지 다운로드 기능 준비 중' })).toBeDisabled();
  });

  it('새로고침 버튼은 목록 재조회 콜백을 호출한다', () => {
    const { onRefresh } = renderView();

    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('편지가 있으면 공개 전에도 토핑 클릭 콜백을 호출한다', () => {
    const onToppingClick = vi.fn();

    render(
      <RollingPaperHostView
        hostName="김이라"
        messages={[
          {
            id: '1',
            writerNickname: '해파링링',
            toppingType: 'cherry',
          },
        ]}
        totalCount={1}
        viewableAt="2099-10-21T22:00:00+09:00"
        writableUntil="2099-10-28T22:00:00+09:00"
        isWritable
        isShareSheetOpen={false}
        inviteShareLink={null}
        isActivatingInvite={false}
        onShareClick={vi.fn()}
        onShareSheetClose={vi.fn()}
        onBackClick={vi.fn()}
        onRefresh={vi.fn()}
        onToppingClick={onToppingClick}
      />,
    );

    expect(screen.getByText(/김이라님을 위해/)).toHaveTextContent(
      '김이라님을 위해롤링페이퍼를 작성해 주세요!',
    );
    expect(screen.getByText(/친구들이 총/)).toHaveTextContent('친구들이 총 1개의 편지를 남겼어요!');
    expect(screen.queryByText(/롤링페이퍼는/)).not.toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveClass('pointer-events-none');
    const topping = screen.getByRole('button', { name: /해파링링/ });
    expect(topping).toHaveAttribute('aria-disabled', 'false');
    fireEvent.click(topping);
    expect(onToppingClick).toHaveBeenCalledWith(0);
    expect(screen.queryByText(/토핑을 눌러 확인해 보세요!/)).not.toBeInTheDocument();
  });

  it('공개 후에는 토핑을 활성화하고 작성 기간 동안 공유 영역을 유지한다', () => {
    const onToppingClick = vi.fn();

    render(
      <RollingPaperHostView
        hostName="김이라"
        messages={[{ id: '1', writerNickname: '해파링링', toppingType: 'cherry' }]}
        totalCount={1}
        viewableAt="2099-10-21T22:00:00+09:00"
        writableUntil="2099-10-28T22:00:00+09:00"
        isViewable
        isWritable
        isShareSheetOpen={false}
        inviteShareLink={null}
        isActivatingInvite={false}
        onShareClick={vi.fn()}
        onShareSheetClose={vi.fn()}
        onBackClick={vi.fn()}
        onRefresh={vi.fn()}
        onToppingClick={onToppingClick}
      />,
    );

    const topping = screen.getByRole('button', { name: /해파링링/ });
    expect(topping).toHaveAttribute('aria-disabled', 'false');
    fireEvent.click(topping);
    expect(onToppingClick).toHaveBeenCalledWith(0);
    expect(screen.getByText('김이라님의 롤링페이퍼')).toBeInTheDocument();
    expect(screen.getByText(/토핑을 눌러 확인해 보세요!/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/작성 가능한 시간/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '롤링페이퍼 공유하기' })).toBeInTheDocument();
  });

  it('작성 기간이 끝나면 공개 전이어도 공유 영역을 노출하지 않는다', () => {
    render(
      <RollingPaperHostView
        hostName="김이라"
        viewableAt="2099-10-21T22:00:00+09:00"
        writableUntil="2099-10-28T22:00:00+09:00"
        isWritable={false}
        isShareSheetOpen={false}
        inviteShareLink={null}
        isActivatingInvite={false}
        onShareClick={vi.fn()}
        onShareSheetClose={vi.fn()}
        onBackClick={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByText(/작성 가능한 시간/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '롤링페이퍼 공유하기' })).not.toBeInTheDocument();
  });

  it('화면을 열어둔 채 작성 마감 시각이 지나면 공유 영역을 제거한다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-21T21:59:59+09:00'));

    try {
      render(
        <RollingPaperHostView
          hostName="김이라"
          viewableAt="2026-10-21T22:00:00+09:00"
          writableUntil="2026-10-21T22:00:00+09:00"
          isWritable
          isShareSheetOpen={false}
          inviteShareLink={null}
          isActivatingInvite={false}
          onShareClick={vi.fn()}
          onShareSheetClose={vi.fn()}
          onBackClick={vi.fn()}
          onRefresh={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: '롤링페이퍼 공유하기' })).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.queryByRole('button', { name: '롤링페이퍼 공유하기' })).not.toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('실시간 파티 종료 후 편지가 없으면 종료 후 안내와 전체 폭 공유 버튼을 표시한다', () => {
    render(
      <RollingPaperHostView
        partyType="realtime"
        hostName="김이라"
        writableUntil="2099-10-28T22:00:00+09:00"
        isViewable
        isWritable
        isShareSheetOpen={false}
        inviteShareLink={null}
        isActivatingInvite={false}
        onShareClick={vi.fn()}
        onShareSheetClose={vi.fn()}
        onBackClick={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );

    expect(screen.getByText('아직 편지를 남긴 친구가 없어요')).toBeInTheDocument();
    expect(screen.getByText(/링크를 공유해 친구들에게 알려보세요!/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '롤링페이퍼 공유하기' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '이미지 다운로드 기능 준비 중' }),
    ).not.toBeInTheDocument();
  });

  it('실시간 파티 종료 후 편지가 있으면 편지 개수와 다운로드 UI를 표시한다', () => {
    const onToppingClick = vi.fn();

    render(
      <RollingPaperHostView
        partyType="realtime"
        hostName="김이라"
        messages={[{ id: '1', writerNickname: '해파링링', toppingType: 'cherry' }]}
        totalCount={1}
        writableUntil="2099-10-28T22:00:00+09:00"
        isViewable
        isWritable
        isShareSheetOpen={false}
        inviteShareLink={null}
        isActivatingInvite={false}
        onShareClick={vi.fn()}
        onShareSheetClose={vi.fn()}
        onBackClick={vi.fn()}
        onRefresh={vi.fn()}
        onToppingClick={onToppingClick}
      />,
    );

    expect(screen.getByText(/김이라님을 위해/)).toHaveTextContent(
      '김이라님을 위해롤링페이퍼를 작성해 주세요!',
    );
    expect(screen.getByText(/친구들이 총/)).toHaveTextContent('친구들이 총 1개의 편지를 남겼어요!');
    expect(screen.queryByText(/토핑을 눌러 확인해 보세요!/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '이미지 다운로드 기능 준비 중' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /해파링링/ }));
    expect(onToppingClick).toHaveBeenCalledWith(0);
  });
});
