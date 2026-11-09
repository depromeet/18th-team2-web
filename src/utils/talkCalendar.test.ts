import { describe, expect, it } from 'vitest';

import { getCalendarConsentMessage, isCalendarConsentSuccess } from '@/utils/talkCalendar';

describe('talkCalendar', () => {
  it.each([
    ['registered', '카카오 톡캘린더에 일정을 등록했어요.'],
    ['already_registered', '이미 등록했어요.'],
    ['party_already_started', '이미 시작된 파티는 등록할 수 없어요.'],
    ['invite_invalid', '초대 링크가 만료됐어요.'],
    ['expired', '카카오 톡캘린더 동의 시간이 만료되었어요.'],
    ['failed', '카카오 톡캘린더 동의 처리에 실패했어요.'],
    ['unknown', '카카오 톡캘린더 알림을 등록할 수 없어요.'],
  ])('%s 결과에 맞는 안내 문구를 반환한다', (result, message) => {
    expect(getCalendarConsentMessage(result)).toBe(message);
  });

  it.each([
    ['registered', true],
    ['already_registered', true],
    ['party_already_started', false],
    ['invite_invalid', false],
    ['failed', false],
  ])('%s 결과의 성공 여부를 판별한다', (result, expected) => {
    expect(isCalendarConsentSuccess(result)).toBe(expected);
  });
});
