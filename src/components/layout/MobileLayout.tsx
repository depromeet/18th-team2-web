import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Toast } from '@/components/ui/Toast';
import { useLoginSuccessToast } from '@/hooks/useLoginSuccessToast';

export function MobileLayout() {
  const { toast, closeToast } = useLoginSuccessToast();

  return (
    <div className="min-h-dvh overflow-x-hidden bg-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-150 flex-col overflow-x-hidden bg-white">
        <Outlet />
      </div>
      <ScrollRestoration />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
