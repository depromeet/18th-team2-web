import { useEffect, useState } from 'react';
import { DUMMY_HOST_NAME } from '@/constants/partyCreate';
import { clampHostName } from '@/utils/string';

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
