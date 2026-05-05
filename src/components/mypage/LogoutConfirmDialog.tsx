import { useEffect, useRef } from 'react';

import { B1, H3 } from '@/components/ui/Typography';

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmDialog({ isOpen, onCancel, onConfirm }: LogoutConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    confirmButtonRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative mx-auto flex w-full max-w-[343px] flex-col items-center gap-8 rounded-[20px] bg-white px-0 pt-6 pb-4">
        <div className="flex w-full flex-col items-center gap-3 px-3">
          <H3 id="logout-dialog-title" className="text-grey-700 text-center">
            계정에서 로그아웃 할게요
          </H3>
          <B1 className="text-grey-500 text-center font-medium">
            확인 버튼을 누르면 홈으로 돌아가요
          </B1>
        </div>
        <div className="flex w-full items-center justify-center gap-1.5 px-3">
          <button
            type="button"
            onClick={onCancel}
            className="border-grey-100 rounded-btn-lg text-body-1 text-grey-900 flex h-14 flex-1 items-center justify-center border bg-white font-semibold"
          >
            취소
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className="rounded-btn-lg text-body-1 flex h-14 flex-1 items-center justify-center bg-blue-500 font-semibold text-white"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
