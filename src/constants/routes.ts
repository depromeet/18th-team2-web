export const ROUTES = {
  home: '/',
  onboarding: '/onboarding',
  oauthCallback: '/oauth/callback',
  createParty: '/create-party',
  createPartyIntro: '/create-party/intro',
  createPartyTime: '/create-party/time',
  archive: '/archive',
  rollingPaper: '/rolling-paper/:id',
  mypage: '/mypage',
} as const;

export function buildRollingPaperPath(id: string) {
  return `/rolling-paper/${id}`;
}
