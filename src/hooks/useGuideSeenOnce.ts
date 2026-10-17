import { useCallback, useEffect, useState } from 'react';

function hasSeenGuide(storageKey: string) {
  try {
    return window.localStorage.getItem(storageKey) === '1';
  } catch {
    return false;
  }
}

function markGuideSeen(storageKey: string) {
  try {
    window.localStorage.setItem(storageKey, '1');
  } catch {
    // 저장소 접근이 막힌 환경(사생활 보호 모드 등)에서는 매번 노출된다
  }
}

/**
 * 가이드를 기기당 한 번만 노출한다. 로그인 여부와 무관하게 localStorage 기준으로 판정한다.
 */
export function useGuideSeenOnce(storageKey: string) {
  const [isOpen, setIsOpen] = useState(() => !hasSeenGuide(storageKey));

  useEffect(() => {
    if (isOpen) markGuideSeen(storageKey);
  }, [isOpen, storageKey]);

  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, close };
}
