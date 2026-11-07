import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { UpcomingPartyCard } from '@/components/home/UpcomingPartyCard';
import { PARTY_ROLE } from '@/constants/party';
import type { UpcomingParty } from '@/types/home';

vi.mock('@/components/ui/icons/ErrorCircleFilledIcon', () => ({
  ErrorCircleFilledIcon: () => <svg aria-hidden="true" />,
}));

const baseParty: UpcomingParty = {
  partyId: '1',
  inviteToken: 'invite-token',
  partyName: '홍길동님의 생일파티',
  date: '26.11.23',
  time: '오후 2:00',
  realtimeEnterable: false,
  role: PARTY_ROLE.HOST,
  partyOption: 'REALTIME',
  isOpen: false,
  isEnded: false,
};

describe('UpcomingPartyCard', () => {
  it('입장 가능한 라이브 파티에는 진행 중 상태를 표시한다', () => {
    render(
      <UpcomingPartyCard
        party={{
          ...baseParty,
          realtimeEnterable: true,
          realtimeSchedule: {
            enterableFrom: '2020-11-23T13:55:00+09:00',
            liveStartAt: '2020-11-23T14:00:00+09:00',
            liveEndAt: '2099-11-23T14:10:00+09:00',
          },
        }}
      />,
    );

    expect(screen.getByText('진행 중')).toHaveClass('text-blue-800');
    expect(screen.getByText('라이브 파티')).toBeInTheDocument();
  });

  it('입장 가능한 5분 전 구간에는 예정된 파티 상태를 유지한다', () => {
    const now = Date.now();

    render(
      <UpcomingPartyCard
        party={{
          ...baseParty,
          realtimeEnterable: true,
          realtimeSchedule: {
            enterableFrom: new Date(now - 1000).toISOString(),
            liveStartAt: new Date(now + 5 * 60 * 1000).toISOString(),
            liveEndAt: new Date(now + 15 * 60 * 1000).toISOString(),
          },
        }}
      />,
    );

    expect(screen.getByText('예정된 파티')).toHaveClass('text-grey-500');
    expect(screen.getByRole('button', { name: '파티 입장하기' })).toBeInTheDocument();
  });

  it('마감된 롤링페이퍼에는 마감 상태와 확인 버튼을 표시한다', () => {
    render(
      <UpcomingPartyCard
        party={{
          ...baseParty,
          partyName: '홍길동님의 롤링페이퍼',
          endDate: '26.11.30',
          partyOption: 'PAPER_ONLY',
          isEnded: true,
        }}
      />,
    );

    expect(screen.getByText('마감됨')).toHaveClass('text-red-700');
    expect(screen.getByText('롤링페이퍼')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '롤링페이퍼 확인하기' })).toBeInTheDocument();
  });
});
