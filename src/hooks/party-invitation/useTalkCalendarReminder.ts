import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';

import { ApiError } from '@/services/api';
import {
  useIssueGuestTalkCalendarConsentUrl,
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
  inviteToken?: string;
  isAuthenticated: boolean;
  showToast: (type: TalkCalendarToastType, message: string) => void;
  openLoginPrompt: () => void;
  /** 로그인·톡캘린더 동의 후 돌아올 위치. 기본값은 현재 위치 */
  returnLocation?: Pick<Location, 'pathname' | 'search'>;
}

interface TalkCalendarRegistrationOptions {
  allowConsentRedirect?: boolean;
}

export function useTalkCalendarReminder({
  partyId,
  inviteToken,
  isAuthenticated,
  showToast,
  openLoginPrompt,
  returnLocation,
}: UseTalkCalendarReminderParams) {
  const navigate = useNavigate();
  const location = useLocation();
  const reminderReturnLocation = returnLocation ?? location;
  const [hasRegisteredTalkCalendar, setHasRegisteredTalkCalendar] = useState(false);
  const handledTalkCalendarReturnRef = useRef(false);
  const { mutate: registerTalkCalendar, isPending: isRegisteringTalkCalendar } =
    useRegisterPartyTalkCalendar();
  const { mutate: issueTalkCalendarConsentUrl, isPending: isIssuingTalkCalendarConsentUrl } =
    useIssueTalkCalendarConsentUrl();
  const {
    mutate: issueGuestTalkCalendarConsentUrl,
    isPending: isIssuingGuestTalkCalendarConsentUrl,
  } = useIssueGuestTalkCalendarConsentUrl(
    inviteToken ?? '',
    buildTalkCalendarReturnPath(reminderReturnLocation),
  );

  const redirectToConsentUrl = useCallback(
    (consentUrl?: string) => {
      if (!consentUrl) {
        showToast('error', '카카오 톡캘린더 동의 URL을 받아오지 못했어요. 다시 시도해주세요.');
        return;
      }

      window.location.href = consentUrl;
    },
    [showToast],
  );

  const showConsentUrlError = useCallback(() => {
    showToast('error', '카카오 톡캘린더 동의 URL을 받아오지 못했어요. 다시 시도해주세요.');
  }, [showToast]);

  const handleTalkCalendarError = useCallback(
    (error: unknown, allowConsentRedirect: boolean) => {
      if (error instanceof ApiError && error.code === CALENDAR_CONSENT_REQUIRED_CODE) {
        if (!allowConsentRedirect) {
          showToast('error', '카카오 톡캘린더 알림을 등록할 수 없어요. 잠시 후 다시 시도해주세요.');
          return;
        }

        issueTalkCalendarConsentUrl(buildTalkCalendarReturnPath(reminderReturnLocation, true), {
          onSuccess: (res) => redirectToConsentUrl(res.data?.consentUrl),
          onError: showConsentUrlError,
        });
        return;
      }

      if (error instanceof ApiError && error.message) {
        showToast('error', error.message);
        return;
      }

      showToast('error', '카카오 톡캘린더 알림을 등록할 수 없어요. 다시 시도해주세요.');
    },
    [
      issueTalkCalendarConsentUrl,
      redirectToConsentUrl,
      reminderReturnLocation,
      showConsentUrlError,
      showToast,
    ],
  );

  const requestTalkCalendarRegistration = useCallback(
    ({ allowConsentRedirect = true }: TalkCalendarRegistrationOptions = {}) => {
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
        onError: (error) => handleTalkCalendarError(error, allowConsentRedirect),
      });
    },
    [handleTalkCalendarError, hasRegisteredTalkCalendar, partyId, registerTalkCalendar, showToast],
  );

  const handleRegisterTalkCalendar = useCallback(() => {
    if (!isAuthenticated) {
      if (inviteToken) {
        issueGuestTalkCalendarConsentUrl(undefined, {
          onSuccess: (res) => redirectToConsentUrl(res.data?.consentUrl),
          onError: showConsentUrlError,
        });
        return;
      }

      useAuthStore
        .getState()
        .setRedirectUrl(buildTalkCalendarReturnPath(reminderReturnLocation, true));
      openLoginPrompt();
      return;
    }

    requestTalkCalendarRegistration();
  }, [
    inviteToken,
    isAuthenticated,
    issueGuestTalkCalendarConsentUrl,
    openLoginPrompt,
    redirectToConsentUrl,
    reminderReturnLocation,
    requestTalkCalendarRegistration,
    showConsentUrlError,
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const calendarConsent = params.get(CALENDAR_CONSENT_QUERY_KEY);
    const shouldRegisterAfterLogin = params.get(CALENDAR_REMINDER_QUERY_KEY) === '1';

    if (!calendarConsent && !shouldRegisterAfterLogin) return;
    if (handledTalkCalendarReturnRef.current) return;

    handledTalkCalendarReturnRef.current = true;
    navigate(buildTalkCalendarReturnPath(location), { replace: true });

    // 비회원 콜백에서는 서버가 이미 일정을 등록한다. 결과 안내는 진입 페이지에서 처리한다.
    if (!isAuthenticated && calendarConsent && calendarConsent !== 'granted') return;

    if (calendarConsent && calendarConsent !== 'granted') {
      showToast('error', getCalendarConsentMessage(calendarConsent));
      return;
    }

    if (isAuthenticated) {
      requestTalkCalendarRegistration({
        // 동의를 마치고 돌아온 뒤에는 다시 동의 URL로 보내지 않아 무한 리다이렉트를 막는다.
        allowConsentRedirect: calendarConsent !== 'granted',
      });
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
    isTalkCalendarPending:
      isRegisteringTalkCalendar ||
      isIssuingTalkCalendarConsentUrl ||
      isIssuingGuestTalkCalendarConsentUrl,
    handleRegisterTalkCalendar,
  };
}
