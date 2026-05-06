import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      useAuthStore.getState().setToken(token);
      const redirectUrl = useAuthStore.getState().redirectUrl;
      useAuthStore.getState().clearRedirectUrl();
      navigate(redirectUrl ?? ROUTES.home, { replace: true });
    } else {
      navigate(ROUTES.home, { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <p className="text-grey-400 text-body-1">로그인 처리 중...</p>
    </div>
  );
}
