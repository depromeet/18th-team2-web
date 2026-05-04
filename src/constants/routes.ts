export const ROUTES = {
  home: '/',
  onboarding: '/onboarding',
  oauthCallback: '/oauth/callback',
  createParty: '/create-party',
  createPartyIntro: '/create-party/intro',
  createPartyTime: '/create-party/time',
  createPartyCharacter: '/create-party/character',
  createPartyComplete: '/create-party/complete',
  archive: '/archive',
  rollingPaper: '/rolling-paper/:id',
  mypage: '/mypage',
  partyInvitation: '/party/:partyId/invitation',
  partyEnter: (partyId: string) => `/party/${partyId}/enter`,
  rollingPaperWrite: (partyId: string) => `/party/${partyId}/rolling-paper/write`,
} as const;

export function buildRollingPaperPath(id: string) {
  return `/rolling-paper/${id}`;
}
