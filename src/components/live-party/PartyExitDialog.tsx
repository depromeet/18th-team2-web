import { useEffect, useRef } from 'react';

import { H3 } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

interface PartyExitDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PartyExitDialog({ isOpen, onCancel, onConfirm }: PartyExitDialogProps) {
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
      aria-labelledby="party-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative mx-auto flex w-full max-w-[343px] flex-col items-center gap-8 rounded-[20px] bg-white px-0 pt-6 pb-4">
        <H3 id="party-dialog-title" className="text-grey-700 text-center">
          아직 파티가 진행 중이에요! <br /> 파티를 나가시겠어요?
        </H3>
        <div className="flex w-full items-center justify-center gap-1.5 px-3">
          <Button
            buttonRef={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            variant="white-grey"
          >
            네
          </Button>
          <Button type="button" onClick={onCancel}>
            아니오
          </Button>
        </div>
      </div>
    </div>
  );
}
