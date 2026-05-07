import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { LoginPromptSheet } from '@/components/ui/LoginPromptSheet';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';

const ROUTE_PREFIXES = {
  createRollingPaper: ROUTES.createRollingPaper,
  createParty: ROUTES.createParty,
  archive: ROUTES.archive,
  mypage: ROUTES.mypage,
  rollingPaper: '/rolling-paper',
} as const;

function getLoginPromptTitlePrefix(pathname: string): string {
  if (pathname.startsWith(ROUTE_PREFIXES.createRollingPaper)) {
    return '롤링페이퍼를 만들기 위해서는';
  }

  if (pathname.startsWith(ROUTE_PREFIXES.createParty)) {
    return '파티를 만들기 위해서는';
  }

  if (pathname.startsWith(ROUTE_PREFIXES.archive)) {
    return '보관함을 이용하기 위해서는';
  }

  if (pathname.startsWith(ROUTE_PREFIXES.mypage)) {
    return '계정 관리를 이용하기 위해서는';
  }

  if (pathname.startsWith(ROUTE_PREFIXES.rollingPaper)) {
    return '롤링페이퍼를 확인하기 위해서는';
  }

  return '서비스를 이용하기 위해서는';
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
        titlePrefix={getLoginPromptTitlePrefix(location.pathname)}
        onClose={() => window.history.back()}
      />
    );
  }

  return <Outlet />;
}
