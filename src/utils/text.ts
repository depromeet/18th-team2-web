/**
 * 자소(grapheme) 단위 길이를 반환합니다.
 * 이모지/한글 결합 문자 등 다중 코드포인트 문자열도 사람이 인지하는 글자 수에 가깝게 셉니다.
 */
export function getGraphemeLength(text: string): number {
  return Array.from(text).length;
}

/**
 * 자소 단위로 문자열을 잘라 최대 길이 이하로 만듭니다.
 */
export function truncateByGrapheme(text: string, max: number): string {
  return Array.from(text).slice(0, max).join('');
}
