import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ApiError } from '@/services/api';
import {
  useIssueTalkCalendarConsentUrl,
  useRegisterPartyTalkCalendar,
} from '@/services/talk-calendar';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  buildTalkCalendarReturnPath,
  CALENDAR_CONSENT_QUERY_KEY,
  CALENDAR_CONSENT_REQUIRED_CODE,
  CALENDAR_REMINDER_QUERY_KEY,
  getCalendarConsentMessage,
} from '@/utils/talkCalendar';

type TalkCalendarToastType = 'success' | 'error';

interface UseTalkCalendarReminderParams {
  partyId: string;
  isAuthenticated: boolean;
  showToast: (type: TalkCalendarToastType, message: string) => void;
  openLoginPrompt: () => void;
}

export function useTalkCalendarReminder({
  partyId,
  isAuthenticated,
  showToast,
  openLoginPrompt,
}: UseTalkCalendarReminderParams) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasRegisteredTalkCalendar, setHasRegisteredTalkCalendar] = useState(false);
  const handledTalkCalendarReturnRef = useRef(false);
  const { mutate: registerTalkCalendar, isPending: isRegisteringTalkCalendar } =
    useRegisterPartyTalkCalendar();
  const { mutate: issueTalkCalendarConsentUrl, isPending: isIssuingTalkCalendarConsentUrl } =
    useIssueTalkCalendarConsentUrl();

  const handleTalkCalendarError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiError && error.code === CALENDAR_CONSENT_REQUIRED_CODE) {
        issueTalkCalendarConsentUrl(buildTalkCalendarReturnPath(location, true), {
          onSuccess: (res) => {
            const consentUrl = res.data?.consentUrl;

            if (!consentUrl) {
              showToast(
                'error',
                '카카오 톡캘린더 동의 URL을 받아오지 못했어요. 다시 시도해주세요.',
              );
              return;
            }

            window.location.href = consentUrl;
          },
          onError: () => {
            showToast('error', '카카오 톡캘린더 동의 URL을 받아오지 못했어요. 다시 시도해주세요.');
          },
        });
        return;
      }

      if (error instanceof ApiError && error.message) {
        showToast('error', error.message);
        return;
      }

      showToast('error', '카카오 톡캘린더 알림을 등록할 수 없어요. 다시 시도해주세요.');
    },
    [issueTalkCalendarConsentUrl, location, showToast],
  );

  const requestTalkCalendarRegistration = useCallback(() => {
    if (hasRegisteredTalkCalendar) {
      showToast('success', '이미 알림을 설정했어요.');
      return;
    }

    registerTalkCalendar(partyId, {
      onSuccess: (res) => {
        setHasRegisteredTalkCalendar(true);
        showToast(
          'success',
          res.data?.updated ? '이미 알림을 설정했어요.' : '카카오 톡캘린더 알림이 등록됐어요.',
        );
      },
      onError: handleTalkCalendarError,
    });
  }, [
    handleTalkCalendarError,
    hasRegisteredTalkCalendar,
    partyId,
    registerTalkCalendar,
    showToast,
  ]);

  const handleRegisterTalkCalendar = useCallback(() => {
    if (!isAuthenticated) {
      useAuthStore.getState().setRedirectUrl(buildTalkCalendarReturnPath(location, true));
      openLoginPrompt();
      return;
    }

    requestTalkCalendarRegistration();
  }, [isAuthenticated, location, openLoginPrompt, requestTalkCalendarRegistration]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const calendarConsent = params.get(CALENDAR_CONSENT_QUERY_KEY);
    const shouldRegisterAfterLogin = params.get(CALENDAR_REMINDER_QUERY_KEY) === '1';

    if (!calendarConsent && !shouldRegisterAfterLogin) return;
    if (handledTalkCalendarReturnRef.current) return;

    handledTalkCalendarReturnRef.current = true;
    navigate(buildTalkCalendarReturnPath(location), { replace: true });

    if (calendarConsent && calendarConsent !== 'granted') {
      showToast('error', getCalendarConsentMessage(calendarConsent));
      return;
    }

    if (isAuthenticated) {
      requestTalkCalendarRegistration();
      return;
    }

    openLoginPrompt();
  }, [
    isAuthenticated,
    location,
    navigate,
    openLoginPrompt,
    requestTalkCalendarRegistration,
    showToast,
  ]);

  return {
    isTalkCalendarPending: isRegisteringTalkCalendar || isIssuingTalkCalendarConsentUrl,
    handleRegisterTalkCalendar,
  };
}
