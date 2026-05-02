import { useNavigate } from 'react-router-dom';

import hapalinLogo from '@/assets/images/hapalin-logo.png';
import iconPerson from '@/assets/icons/icon-person.svg';
import { ROUTES } from '@/constants/routes';
import { useLogout } from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';

export function HomeHeader() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { logout } = useLogout();

  return (
    <header className="flex h-11.5 items-center justify-between px-4">
      <img src={hapalinLogo} alt="해파링 로고" className="h-7.5" />
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <button type="button" className="text-grey-400 text-caption-1" onClick={logout}>
            로그아웃
          </button>
        )}
        <button type="button" onClick={() => navigate(ROUTES.mypage)}>
          <img src={iconPerson} alt="프로필" className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
