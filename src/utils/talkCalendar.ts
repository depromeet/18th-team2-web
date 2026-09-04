export function getCalendarConsentMessage(calendarConsent: string) {
  switch (calendarConsent) {
    case 'denied':
      return '카카오 톡캘린더 동의가 취소되었어요.';
    case 'account_mismatch':
      return '로그인한 카카오 계정이 달라 알림을 등록할 수 없어요.';
    case 'expired':
      return '카카오 톡캘린더 동의 시간이 만료되었어요. 다시 시도해주세요.';
    case 'failed':
      return '카카오 톡캘린더 동의 처리에 실패했어요. 다시 시도해주세요.';
    default:
      return '카카오 톡캘린더 알림을 등록할 수 없어요. 다시 시도해주세요.';
  }
}
