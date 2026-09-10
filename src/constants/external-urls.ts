export const EXTERNAL_URLS = {
  GOOGLE_FORM: 'https://forms.gle/4XXL6sDs3mw56rgw8',
} as const;

export const SHARE_ENDPOINTS = {
  x: (encodedUrl: string, encodedTitle: string) =>
    `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  naver: (encodedUrl: string, encodedTitle: string) =>
    `https://share.naver.com/web/shareView?url=${encodedUrl}&title=${encodedTitle}`,
  facebook: (encodedUrl: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  line: (encodedUrl: string) => `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
} as const;
