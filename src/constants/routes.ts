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

  // 초대링크 통합 진입점 (inviteToken 기반)
  partyInvite: '/invite/:inviteToken',

  // TODO: BE 입장/작성 API 명세 확정 시 partyId 기반으로 변경 가능
  // 현재는 진입점(inviteToken)에서 그대로 이어지도록 inviteToken 기반 유지
  partyInviteEnter: '/invite/:inviteToken/enter',
  partyInviteRollingPaperWrite: '/invite/:inviteToken/rolling-paper/write',
} as const;
