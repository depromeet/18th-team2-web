// 카카오톡·인스타그램·페이스북·네이버·라인 앱 내 브라우저
const IN_APP_BROWSER_PATTERN = /KAKAOTALK|Instagram|FBAN|FBAV|NAVER|Line\//i;

/**
 * 앱 내(인앱) 브라우저 여부.
 * 인앱 브라우저는 <a download> 파일 다운로드를 막는 경우가 많고, 막혀도 결과를 알려주지 않아
 * 다운로드 성공 여부를 판단할 수 없으므로 user agent로 미리 구분한다.
 */
export function isInAppBrowser(userAgent: string = navigator.userAgent): boolean {
  return IN_APP_BROWSER_PATTERN.test(userAgent);
}
