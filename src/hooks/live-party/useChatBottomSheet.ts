import { useEffect, useRef, useState } from 'react';

const DEFAULT_MIN_HEIGHT = 283;
const COMPACT_MIN_HEIGHT = 260;
const EXPANDED_TOP_OFFSET_WITH_OVERLAY = 236;
const EXPANDED_TOP_OFFSET_DEFAULT = 123;
const MIN_USABLE_HEIGHT = 180;
const MIN_TOP_OFFSET = 96;

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function getSheetBounds(hasTopOverlayContent: boolean) {
  const viewportHeight = getViewportHeight();
  const baseMinHeight = viewportHeight < 700 ? COMPACT_MIN_HEIGHT : DEFAULT_MIN_HEIGHT;
  const minHeight = Math.min(
    baseMinHeight,
    Math.max(MIN_USABLE_HEIGHT, viewportHeight - MIN_TOP_OFFSET),
  );
  const expandedTopOffset = hasTopOverlayContent
    ? EXPANDED_TOP_OFFSET_WITH_OVERLAY
    : EXPANDED_TOP_OFFSET_DEFAULT;
  const maxHeight = Math.max(minHeight, viewportHeight - expandedTopOffset);

  return { minHeight, maxHeight };
}

export interface ChatMessage {
  id: number;
  user: {
    name: string;
    profileImage: string | null;
    senderRole: 'PARTICIPANT' | 'CELEBRANT';
  };
  text: string;
}

export type ChatListItem =
  | {
      type: 'message';
      id: number;
      user: {
        name: string;
        profileImage: string | null;
        senderRole: 'PARTICIPANT' | 'CELEBRANT';
      };
      text: string;
    }
  | {
      type: 'entry';
      id: number;
      userName: string;
    }
  | {
      type: 'exit';
      id: number;
      userName: string;
    };

interface UseChatBottomSheetOptions {
  hasTopOverlayContent?: boolean;
}

export function useChatBottomSheet({
  hasTopOverlayContent = false,
}: UseChatBottomSheetOptions = {}) {
  const [bounds, setBounds] = useState(() => getSheetBounds(hasTopOverlayContent));
  const [height, setHeight] = useState(bounds.minHeight);
  const [isDragging, setIsDragging] = useState(false);

  const midHeight = (bounds.minHeight + bounds.maxHeight) / 2;
  const isExpanded = height > bounds.minHeight + 1;

  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const expand = () => {
    setHeight(bounds.maxHeight);
  };

  const collapse = () => {
    setHeight(bounds.minHeight);
  };

  const toggle = () => {
    if (isExpanded) collapse();
    else expand();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!draggingRef.current) return;
    const delta = e.clientY - startYRef.current;
    const nextHeight = Math.max(
      bounds.minHeight,
      Math.min(bounds.maxHeight, startHeightRef.current - delta),
    );
    setHeight(nextHeight);
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (height > midHeight) setHeight(bounds.maxHeight);
    else setHeight(bounds.minHeight);
  };

  useEffect(() => {
    const viewport = window.visualViewport;

    function syncBounds() {
      const nextBounds = getSheetBounds(hasTopOverlayContent);
      setBounds(nextBounds);
      setHeight((currentHeight) => {
        const isCollapsed = currentHeight <= bounds.minHeight + 1;
        if (isCollapsed) return nextBounds.minHeight;

        return nextBounds.maxHeight;
      });
    }

    syncBounds();
    window.addEventListener('resize', syncBounds);
    viewport?.addEventListener('resize', syncBounds);
    viewport?.addEventListener('scroll', syncBounds);

    return () => {
      window.removeEventListener('resize', syncBounds);
      viewport?.removeEventListener('resize', syncBounds);
      viewport?.removeEventListener('scroll', syncBounds);
    };
  }, [bounds.minHeight, hasTopOverlayContent]);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  return {
    height,
    isExpanded,
    isDragging,
    handlePointerDown,
    expand,
    collapse,
    toggle,
  };
}
