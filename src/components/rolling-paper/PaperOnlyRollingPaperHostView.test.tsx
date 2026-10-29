import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PaperOnlyRollingPaperHostView } from '@/components/rolling-paper/PaperOnlyRollingPaperHostView';

vi.mock('@/assets/images/icons/close.svg?react', () => ({
  default: () => <svg aria-hidden="true" />,
}));

vi.mock('@/assets/images/icons/download.svg?react', () => ({
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
    <PaperOnlyRollingPaperHostView
      viewableAt="2099-10-21T22:00:00+09:00"
      writableUntil="2099-10-28T22:00:00+09:00"
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

describe('PaperOnlyRollingPaperHostView', () => {
  it('공개 일시와 작성 마감 카운트다운을 표시한다', () => {
    renderView();

    expect(screen.getByText('아직 편지를 남긴 친구가 없어요')).toBeInTheDocument();
    expect(screen.getByText('10월 21일 밤 10시')).toBeInTheDocument();
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

  it('편지가 있으면 기존 토핑을 공개 전 비활성 상태로 표시한다', () => {
    render(
      <PaperOnlyRollingPaperHostView
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
        isShareSheetOpen={false}
        inviteShareLink={null}
        isActivatingInvite={false}
        onShareClick={vi.fn()}
        onShareSheetClose={vi.fn()}
        onBackClick={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );

    expect(screen.getByText(/김이라님을 위해/)).toHaveTextContent(
      '김이라님을 위해롤링페이퍼를 작성해 주세요!',
    );
    expect(screen.getByText(/친구들이 총/)).toHaveTextContent('친구들이 총 1개의 편지를 남겼어요!');
    expect(screen.queryByText(/롤링페이퍼는/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /해파링링/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('공개 후에는 토핑을 활성화하고 클릭 콜백을 호출한다', () => {
    const onToppingClick = vi.fn();

    render(
      <PaperOnlyRollingPaperHostView
        messages={[{ id: '1', writerNickname: '해파링링', toppingType: 'cherry' }]}
        totalCount={1}
        viewableAt="2099-10-21T22:00:00+09:00"
        writableUntil="2099-10-28T22:00:00+09:00"
        isViewable
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
  });
});
