export const PARTY_ROLE = {
  HOST: 'HOST',
  PARTICIPANT: 'PARTICIPANT',
} as const;

export type PartyRole = keyof typeof PARTY_ROLE;
