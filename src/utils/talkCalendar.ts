import type { Location } from 'react-router-dom';

export const CALENDAR_CONSENT_QUERY_KEY = 'calendarConsent';
export const CALENDAR_REMINDER_QUERY_KEY = 'talkCalendarReminder';
export const CALENDAR_CONSENT_REQUIRED_CODE = 'KAKAO_CALENDAR_CONSENT_REQUIRED';

type TalkCalendarLocation = Pick<Location, 'pathname' | 'search'>;

export function buildTalkCalendarReturnPath(
  location: TalkCalendarLocation,
  includeReminder = false,
) {
  const params = new URLSearchParams(location.search);
  params.delete(CALENDAR_CONSENT_QUERY_KEY);
  params.delete(CALENDAR_REMINDER_QUERY_KEY);

  if (includeReminder) {
    params.set(CALENDAR_REMINDER_QUERY_KEY, '1');
  }

  const search = params.toString();
  return `${location.pathname}${search ? `?${search}` : ''}`;
}

export function getCalendarConsentMessage(calendarConsent: string) {
  switch (calendarConsent) {
    case 'registered':
      return '카카오 톡캘린더에 일정을 등록했어요.';
    case 'already_registered':
      return '이미 등록했어요.';
    case 'party_already_started':
      return '이미 시작된 파티는 등록할 수 없어요.';
    case 'invite_invalid':
      return '초대 링크가 만료됐어요.';
    case 'denied':
      return '카카오 톡캘린더 동의가 취소되었어요.';
    case 'account_mismatch':
      return '카카오 계정이 일치하지 않아요.';
    case 'expired':
      return '카카오 톡캘린더 동의 시간이 만료되었어요.';
    case 'failed':
      return '카카오 톡캘린더 동의 처리에 실패했어요.';
    default:
      return '카카오 톡캘린더 알림을 등록할 수 없어요.';
  }
}

export function isCalendarConsentSuccess(calendarConsent: string) {
  return calendarConsent === 'registered' || calendarConsent === 'already_registered';
}
