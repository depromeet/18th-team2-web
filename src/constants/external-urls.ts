export const EXTERNAL_URLS = {
  // TODO: BE에서 오픈채팅 URL 제공 시 교체
  KAKAO_OPEN_CHAT: 'https://open.kakao.com/',
} as const;

export const SHARE_ENDPOINTS = {
  x: (encodedUrl: string, encodedTitle: string) =>
    `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  naver: (encodedUrl: string, encodedTitle: string) =>
    `https://share.naver.com/web/shareView?url=${encodedUrl}&title=${encodedTitle}`,
  facebook: (encodedUrl: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  line: (encodedUrl: string) => `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
} as const;
