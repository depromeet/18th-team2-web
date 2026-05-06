import { useEffect, useRef, useState } from 'react';

const MIN_HEIGHT = 320;

export function useChatBottomSheet() {
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);

  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const MAX_HEIGHT = 690;
  const MID = (MIN_HEIGHT + MAX_HEIGHT) / 2;

  const handleMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    setIsDragging(true);

    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current) return;

    const delta = e.clientY - startYRef.current;
    let nextHeight = startHeightRef.current - delta;

    nextHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, nextHeight));

    setHeight(nextHeight);
  };

  const handleMouseUp = () => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    setIsDragging(false);

    if (height > MID) {
      setHeight(MAX_HEIGHT);
    } else {
      setHeight(MIN_HEIGHT);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [height]);

  return {
    height,
    handleMouseDown,
    isDragging,
  };
}
