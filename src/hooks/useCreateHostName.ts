import { useEffect, useState } from 'react';
import { DUMMY_HOST_NAME, HOST_NAME_MAX_LENGTH } from '@/constants/partyCreate';

export function clampHostName(value: string): string {
  return Array.from(value).slice(0, HOST_NAME_MAX_LENGTH).join('');
}

export function useCreateHostName(initialHostName?: string) {
  const defaultHostName = clampHostName(initialHostName ?? DUMMY_HOST_NAME);
  const [hostName, setHostNameState] = useState(defaultHostName);
  const [hasEditedHostName, setHasEditedHostName] = useState(false);

  useEffect(() => {
    if (!hasEditedHostName) {
      setHostNameState(defaultHostName);
    }
  }, [defaultHostName, hasEditedHostName]);

  const setHostName = (value: string) => {
    setHasEditedHostName(true);
    setHostNameState(clampHostName(value));
  };

  return { defaultHostName, hostName, setHostName };
}
