export const ROUTES = {
  home: '/',
  onboarding: '/onboarding',
  login: '/login',
  signup: '/signup',
  archive: '/archive',
  rollingPaper: '/rolling-paper/:id',
  mypage: '/mypage',
} as const;

export function buildRollingPaperPath(id: string) {
  return `/rolling-paper/${id}`;
}
