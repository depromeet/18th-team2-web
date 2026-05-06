import { useEffect, useState } from 'react';

/**
 * 모바일 키보드가 올라올 때 화면 하단에 고정된 요소가 가려지지 않도록
 * `visualViewport` 기반으로 하단 오프셋을 계산합니다.
 *
 * 키보드가 닫힌 상태에서는 항상 0을 반환합니다.
 */
export function useViewportBottomOffset(): number {
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    function handleResize() {
      if (!vv) return;
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      setBottomOffset(Math.max(0, offset));
    }

    handleResize();
    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleResize);

    return () => {
      vv.removeEventListener('resize', handleResize);
      vv.removeEventListener('scroll', handleResize);
    };
  }, []);

  return bottomOffset;
}
