import { HOST_NAME_MAX_LENGTH } from '@/constants/partyCreate';

export function clampHostName(value: string): string {
  return Array.from(value).slice(0, HOST_NAME_MAX_LENGTH).join('');
}
