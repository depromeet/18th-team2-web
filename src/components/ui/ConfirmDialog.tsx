import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { B1, H3 } from '@/components/ui/Typography';

type DialogActionVariant = 'primary' | 'secondary' | 'danger';

interface ConfirmDialogAction {
  label: string;
  onClick: () => void;
  variant?: DialogActionVariant;
  autoFocus?: boolean;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: ReactNode;
  description?: ReactNode;
  descriptionTone?: 'default' | 'danger';
  cancelAction?: ConfirmDialogAction;
  confirmAction: ConfirmDialogAction;
  onClose: () => void;
  labelledById?: string;
}

const actionClassNames: Record<DialogActionVariant, string> = {
  primary: '',
  secondary: '',
  danger: '',
};

const actionVariants: Record<DialogActionVariant, 'primary' | 'danger' | 'white-grey'> = {
  primary: 'primary',
  secondary: 'white-grey',
  danger: 'danger',
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  descriptionTone = 'default',
  cancelAction,
  confirmAction,
  onClose,
  labelledById = 'confirm-dialog-title',
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const focusAction = confirmAction.autoFocus === false ? cancelAction : confirmAction;

  const [mounted, setMounted] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    if (focusAction === cancelAction) {
      cancelButtonRef.current?.focus();
    } else {
      confirmButtonRef.current?.focus();
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cancelAction, confirmAction, focusAction, isOpen, onClose]);

  if (!mounted) return null;

  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledById}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <button
        type="button"
        aria-label="팝업 닫기"
        className={`absolute inset-0 cursor-default bg-black/50 ${isClosing ? 'dialog-overlay-out' : 'dialog-overlay-in'}`}
        onClick={onClose}
      />
      <div
        className={`relative mx-auto flex w-[calc(100%-32px)] max-w-[343px] flex-col items-center gap-8 overflow-hidden rounded-[20px] bg-white pt-6 pb-4 ${isClosing ? 'dialog-panel-out' : 'dialog-panel-in'}`}
        onAnimationEnd={() => {
          if (isClosing) {
            setMounted(false);
            setIsClosing(false);
          }
        }}
      >
        <div className="flex w-full flex-col items-center gap-3 px-3 text-center">
          <H3 id={labelledById} className="text-grey-700">
            {title}
          </H3>
          {description && (
            <B1
              as="div"
              className={`font-medium whitespace-pre-wrap ${
                descriptionTone === 'danger' ? 'text-red-400' : 'text-grey-500'
              }`}
            >
              {description}
            </B1>
          )}
        </div>
        <div className="flex w-full items-center justify-center gap-1.5 px-3">
          {cancelAction && (
            <Button
              buttonRef={cancelButtonRef}
              type="button"
              onClick={cancelAction.onClick}
              variant={actionVariants[cancelAction.variant ?? 'secondary']}
              className={actionClassNames[cancelAction.variant ?? 'secondary']}
            >
              {cancelAction.label}
            </Button>
          )}
          <Button
            buttonRef={confirmButtonRef}
            type="button"
            onClick={confirmAction.onClick}
            variant={actionVariants[confirmAction.variant ?? 'primary']}
            className={actionClassNames[confirmAction.variant ?? 'primary']}
          >
            {confirmAction.label}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
