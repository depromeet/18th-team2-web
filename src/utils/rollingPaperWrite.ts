import { generatePath } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

export interface RollingPaperWriteContext {
  completeCta?: 'invite' | 'home';
  invitePath?: string;
  inviteToken?: string;
  hostName?: string;
}

const STORAGE_KEY_PREFIX = 'rolling-paper-write-context:';

export function buildRollingPaperWritePath(partyId: string, inviteToken?: string): string {
  const path = generatePath(ROUTES.rollingPaperWrite, { partyId });
  if (!inviteToken) return path;

  const params = new URLSearchParams({ inviteToken });
  return `${path}?${params.toString()}`;
}

export function readRollingPaperWriteContext(partyId: string): RollingPaperWriteContext | null {
  if (typeof window === 'undefined') return null;

  const raw = window.sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${partyId}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as RollingPaperWriteContext;
  } catch {
    window.sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${partyId}`);
    return null;
  }
}

export function saveRollingPaperWriteContext(partyId: string, context: RollingPaperWriteContext) {
  if (typeof window === 'undefined' || !context.inviteToken) return;

  window.sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${partyId}`, JSON.stringify(context));
}
