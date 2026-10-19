import { useCallback, useState } from 'react';

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
 * 닫기·건너뛰기·배경 클릭·ESC·마지막 장 다음 등 가이드를 닫는 시점에 본 것으로 저장한다.
 */
export function useGuideSeenOnce(storageKey: string) {
  const [isOpen, setIsOpen] = useState(() => !hasSeenGuide(storageKey));

  const close = useCallback(() => {
    markGuideSeen(storageKey);
    setIsOpen(false);
  }, [storageKey]);

  return { isOpen, close };
}
