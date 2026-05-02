import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { LoginPromptSheet } from '@/components/ui/LoginPromptSheet';
import { useAuthStore } from '@/stores/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
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

  return <>{children}</>;
}
