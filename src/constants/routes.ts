export const ROUTES = {
  HOME: '/',
  ONBOARDING: '/onboarding',
  PARTY_INVITATION: '/party/:partyId/invitation',
  PARTY_ENTER: (partyId: string) => `/party/${partyId}/enter`,
  ROLLING_PAPER_WRITE: (partyId: string) => `/party/${partyId}/rolling-paper/write`,
} as const;
