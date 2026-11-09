import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { B2, L2 } from '@/components/ui/Typography';

interface CapturedImagePreviewProps {
  imageUrl: string;
  /** 없으면 저장 버튼을 숨기고 길게 눌러 저장하는 안내만 보여준다 */
  onSave?: () => void;
  onClose: () => void;
}

export function CapturedImagePreview({ imageUrl, onSave, onClose }: CapturedImagePreviewProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    return () => previouslyFocused?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="캡쳐한 이미지"
      className="guide-carousel-fade-in fixed inset-0 z-90 flex items-center justify-center px-8"
    >
      <div role="presentation" className="absolute inset-0 bg-black/90" onClick={onClose} />
      <div className="absolute inset-x-0 top-0 mx-auto flex w-full max-w-150 items-center px-2 pt-[calc(8px+env(safe-area-inset-top))]">
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="닫기"
          className="flex h-12 w-12 cursor-pointer items-center justify-center text-white"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="relative flex w-full max-w-90 flex-col items-center">
        <div className="flex w-fit max-w-full flex-col">
          <img
            src={imageUrl}
            alt="캡쳐한 롤링페이퍼 이미지"
            className="capture-preview-pop max-h-[60dvh] w-auto max-w-full rounded-2xl object-contain"
          />
          {onSave ? (
            <L2 className="text-grey-50 mt-4 w-0 min-w-full text-left">
              * 이미지를 길게 눌러 저장할 수 있어요
            </L2>
          ) : (
            <B2 className="mt-4 w-0 min-w-full text-left font-semibold text-white">
              이미지를 길게 눌러 저장해주세요
            </B2>
          )}
        </div>
      </div>
      {onSave && (
        <div className="pb-safe-bottom-4 absolute inset-x-0 bottom-0 mx-auto w-full max-w-150 px-5">
          <Button type="button" size="full" onClick={onSave}>
            이미지 저장하기
          </Button>
        </div>
      )}
    </div>,
    document.body,
  );
}
