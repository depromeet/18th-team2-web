import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { LoginPromptSheet } from '@/components/ui/LoginPromptSheet';
import { useAuthStore } from '@/stores/useAuthStore';

export function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      useAuthStore.getState().setRedirectUrl(location.pathname);
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    return <LoginPromptSheet isOpen onClose={() => window.history.back()} />;
  }

  return <Outlet />;
}
