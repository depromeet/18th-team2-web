import { createPortal } from 'react-dom';
import { useEffect } from 'react';

import { CheckCircleFilledIcon } from '@/components/ui/icons/CheckCircleFilledIcon';
import { ErrorCircleFilledIcon } from '@/components/ui/icons/ErrorCircleFilledIcon';

export interface ToastState {
  id: number;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toast: ToastState | null;
  duration?: number;
  onClose: () => void;
}

export function Toast({ toast, duration = 2500, onClose }: ToastProps) {
  useEffect(() => {
    if (!toast) return;

    const timerId = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timerId);
  }, [duration, onClose, toast]);

  if (!toast || typeof document === 'undefined') return null;

  const Icon = toast.type === 'success' ? CheckCircleFilledIcon : ErrorCircleFilledIcon;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(40px+env(safe-area-inset-bottom))] z-[100] flex justify-center px-4">
      <div
        className="link-share-toast flex h-[54px] w-[343px] max-w-[calc(100vw-32px)] items-center justify-center gap-2 rounded-lg bg-black/70 px-4 py-4 text-[#dcdcdc] shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
        role={toast.type === 'error' ? 'alert' : 'status'}
      >
        <Icon className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
        <p className="text-body-2 text-center font-semibold break-keep">{toast.message}</p>
      </div>
    </div>,
    document.body,
  );
}
