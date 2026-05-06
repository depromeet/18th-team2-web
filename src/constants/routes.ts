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
  archivePartyDetail: '/archive/party/:partyId',
  archivePaperDetail: '/archive/paper/:paperId',
  rollingPaper: '/rolling-paper/:id',
  mypage: '/mypage',

  // 초대링크 통합 진입점 (inviteToken 기반)
  partyInvite: '/invite/:inviteToken',

  // 진입점 이후 내부 작업은 partyId 기반
  partyEnter: '/party/:partyId/enter',
  partyEnterIntro: '/party/:partyId/enter/intro',
  rollingPaperWrite: '/party/:partyId/rolling-paper/write',
} as const;
