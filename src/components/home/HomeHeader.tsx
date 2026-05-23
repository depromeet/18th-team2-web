import { useNavigate } from 'react-router-dom';

import hapalinLogo from '@/assets/images/hapalin-logo.png';
import iconPerson from '@/assets/icons/icon-person.svg';
import { ROUTES } from '@/constants/routes';
import { useDevToken, useLogout } from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';

export function HomeHeader() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { logout } = useLogout();
  const devToken = useDevToken();

  return (
    <header className="flex h-11.5 items-center justify-between px-4">
      <img src={hapalinLogo} alt="해파링 로고" className="h-7.5" />
      <div className="flex items-center gap-3">
        {import.meta.env.DEV && !isAuthenticated && (
          <button
            type="button"
            className="text-grey-400 text-caption-1"
            onClick={() => devToken.mutate('dev@hapalin.com')}
            disabled={devToken.isPending}
          >
            {devToken.isPending ? '발급 중...' : '[DEV] 토큰'}
          </button>
        )}
        {isAuthenticated && (
          <button type="button" className="text-grey-400 text-caption-1" onClick={logout}>
            로그아웃
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate(ROUTES.mypage)}
          className="rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
        >
          <img src={iconPerson} alt="프로필" className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
