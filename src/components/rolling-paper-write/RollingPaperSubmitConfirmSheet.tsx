import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { B1, H2 } from '@/components/ui/Typography';

interface RollingPaperSubmitConfirmSheetProps {
  isOpen: boolean;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RollingPaperSubmitConfirmSheet({
  isOpen,
  isPending = false,
  onClose,
  onConfirm,
}: RollingPaperSubmitConfirmSheetProps) {
  const [isAnimatedOpen, setIsAnimatedOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsAnimatedOpen(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsAnimatedOpen(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 ${
        isOpen ? 'visible' : 'invisible'
      }`}
    >
      <button
        type="button"
        aria-label="확인창 닫기"
        className={`absolute inset-0 cursor-default bg-black/50 transition-opacity duration-300 ${
          isAnimatedOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rolling-paper-submit-confirm-title"
        className={`relative w-full max-w-93.75 px-2.5 pb-[calc(24px+env(safe-area-inset-bottom))] transition-transform duration-300 ease-out ${
          isAnimatedOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white">
          <div className="flex h-4 items-end justify-center">
            <div className="bg-grey-100 h-1 w-12 rounded-full" />
          </div>
          <div className="flex items-start justify-between px-5 pt-5 pb-2.5">
            <div className="flex flex-col gap-1">
              <H2 id="rolling-paper-submit-confirm-title">롤링페이퍼를 전달할까요?</H2>
              <B1 as="p" className="font-medium text-red-500">
                전달하기를 누르면 다시 확인할 수 없어요
              </B1>
            </div>
            <button
              type="button"
              className="text-grey-400 flex h-5 w-5 shrink-0 items-center justify-center"
              aria-label="확인창 닫기"
              onClick={onClose}
            >
              <CloseIcon width={20} height={20} />
            </button>
          </div>
          <div className="flex gap-2 px-5 py-4">
            <Button className="flex-1" variant="white-grey" onClick={onClose} disabled={isPending}>
              수정하기
            </Button>
            <Button className="flex-1" variant="primary" onClick={onConfirm} disabled={isPending}>
              전달하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
