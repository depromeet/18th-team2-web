import { describe, expect, it } from 'vitest';

import { isInAppBrowser } from '@/utils/browser';

describe('isInAppBrowser', () => {
  it.each([
    ['카카오톡', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) KAKAOTALK 10.4.5'],
    ['인스타그램', 'Mozilla/5.0 (iPhone) Mobile/15E148 Instagram 300.0.0.0'],
    ['페이스북', 'Mozilla/5.0 (iPhone) [FBAN/FBIOS;FBAV/450.0.0.0]'],
    ['네이버', 'Mozilla/5.0 (Linux; Android 14) NAVER(inapp; search; 2000; 12.0.0)'],
    ['라인', 'Mozilla/5.0 (iPhone) Safari Line/13.0.0'],
  ])('%s 인앱 브라우저를 감지한다', (_, userAgent) => {
    expect(isInAppBrowser(userAgent)).toBe(true);
  });

  it.each([
    [
      'iOS Safari',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Version/17.0 Mobile/15E148 Safari/604.1',
    ],
    [
      'Android Chrome',
      'Mozilla/5.0 (Linux; Android 14; SM-S918N) Chrome/124.0.0.0 Mobile Safari/537.36',
    ],
  ])('%s는 인앱 브라우저가 아니다', (_, userAgent) => {
    expect(isInAppBrowser(userAgent)).toBe(false);
  });
});
