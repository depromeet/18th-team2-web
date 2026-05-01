import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { MobileLayout } from '@/components/layout/MobileLayout';
import { ROUTES } from '@/constants/routes';
import { redirectToKakaoLogin, useDevToken, useMe } from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const devToken = useDevToken();
  const { data: meData } = useMe();

  useEffect(() => {
    if (meData?.data) {
      useAuthStore.getState().setUser(meData.data);
      navigate(ROUTES.home, { replace: true });
    }
  }, [meData, navigate]);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />;
  }

  const handleDevLogin = () => {
    devToken.mutate('dev@hapalin.com');
  };

  return (
    <MobileLayout>
      <div className="flex min-h-dvh flex-col items-center justify-center px-5">
        <h1 className="text-title-2 font-bold">로그인</h1>
        <p className="text-grey-300 mt-2 text-body-2">카카오 계정으로 시작하세요</p>

        <button
          type="button"
          className="mt-8 w-full rounded-xl bg-[#FEE500] px-6 py-4 font-semibold text-[#191919]"
          onClick={redirectToKakaoLogin}
        >
          카카오로 시작하기
        </button>

        {import.meta.env.DEV && (
          <button
            type="button"
            className="bg-grey-800 text-grey-50 mt-10 rounded-lg px-6 py-3 text-body-2"
            onClick={handleDevLogin}
            disabled={devToken.isPending}
          >
            {devToken.isPending ? '토큰 발급 중...' : '[DEV] 개발용 토큰 발급'}
          </button>
        )}
      </div>
    </MobileLayout>
  );
}
