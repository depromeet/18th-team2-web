import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTalkCalendarReminder } from '@/hooks/party-invitation/useTalkCalendarReminder';
import { ApiError } from '@/services/api';
import { CALENDAR_CONSENT_REQUIRED_CODE } from '@/utils/talkCalendar';

const talkCalendarMocks = vi.hoisted(() => ({
  register: vi.fn(),
  issueConsentUrl: vi.fn(),
}));

vi.mock('@/services/talk-calendar', () => ({
  useRegisterPartyTalkCalendar: () => ({
    mutate: talkCalendarMocks.register,
    isPending: false,
  }),
  useIssueTalkCalendarConsentUrl: () => ({
    mutate: talkCalendarMocks.issueConsentUrl,
    isPending: false,
  }),
}));

function createWrapper(initialEntry: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>;
  };
}

beforeEach(() => {
  talkCalendarMocks.register.mockReset();
  talkCalendarMocks.issueConsentUrl.mockReset();
});

describe('useTalkCalendarReminder', () => {
  it('최초 등록 요청에서 동의가 필요하면 동의 URL을 요청한다', () => {
    const showToast = vi.fn();
    const { result } = renderHook(
      () =>
        useTalkCalendarReminder({
          partyId: '42',
          isAuthenticated: true,
          showToast,
          openLoginPrompt: vi.fn(),
        }),
      { wrapper: createWrapper('/invite/test-token') },
    );

    act(() => result.current.handleRegisterTalkCalendar());

    const registerOptions = talkCalendarMocks.register.mock.calls[0][1];
    act(() => {
      registerOptions.onError(
        new ApiError(403, '동의가 필요합니다.', CALENDAR_CONSENT_REQUIRED_CODE),
      );
    });

    expect(talkCalendarMocks.issueConsentUrl).toHaveBeenCalledTimes(1);
    expect(showToast).not.toHaveBeenCalled();
  });

  it('동의 완료 후 같은 오류가 반복되면 다시 이동하지 않고 오류 토스트를 표시한다', async () => {
    const showToast = vi.fn();

    renderHook(
      () =>
        useTalkCalendarReminder({
          partyId: '42',
          isAuthenticated: true,
          showToast,
          openLoginPrompt: vi.fn(),
        }),
      {
        wrapper: createWrapper('/invite/test-token?talkCalendarReminder=1&calendarConsent=granted'),
      },
    );

    await waitFor(() => expect(talkCalendarMocks.register).toHaveBeenCalledTimes(1));

    const registerOptions = talkCalendarMocks.register.mock.calls[0][1];
    act(() => {
      registerOptions.onError(
        new ApiError(403, '동의가 필요합니다.', CALENDAR_CONSENT_REQUIRED_CODE),
      );
    });

    expect(talkCalendarMocks.issueConsentUrl).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(
      'error',
      '카카오 톡캘린더 알림을 등록할 수 없어요. 잠시 후 다시 시도해주세요.',
    );
  });
});
