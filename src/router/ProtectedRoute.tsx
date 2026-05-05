import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { LoginPromptSheet } from '@/components/ui/LoginPromptSheet';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';

const LOGIN_DESCRIPTIONS: Partial<Record<string, string>> = {
  [ROUTES.rollingPaperWrite]: '롤링페이퍼를 작성하려면\n로그인이 필요해요',
};

function getLoginDescription(pathname: string): string | undefined {
  const matched = Object.entries(LOGIN_DESCRIPTIONS).find(([pattern]) =>
    new RegExp(pattern.replace(/:\w+/g, '[^/]+')).test(pathname),
  );
  return matched?.[1];
}

export function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      useAuthStore.getState().setRedirectUrl(location.pathname);
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    return (
      <LoginPromptSheet
        isOpen
        description={getLoginDescription(location.pathname)}
        onClose={() => window.history.back()}
      />
    );
  }

  return <Outlet />;
}
