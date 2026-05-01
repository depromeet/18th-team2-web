import { useNavigate } from 'react-router-dom';

import { MobileLayout } from '@/components/layout/MobileLayout';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleDevLogin = () => {
    useAuthStore.getState().setUser({
      id: 'dev-user',
      nickname: '개발자',
      profileImage: null,
    });
    navigate(ROUTES.home);
  };

  return (
    <MobileLayout>
      <div className="flex min-h-dvh flex-col items-center justify-center px-5">
        <h1 className="text-title-2 font-bold">로그인</h1>
        <p className="text-grey-300 mt-2 text-body-2">로그인 페이지 (Figma 연동 후 구현 예정)</p>
        <button
          type="button"
          className="mt-6 text-blue-300 underline"
          onClick={() => navigate(ROUTES.signup)}
        >
          회원가입으로 이동
        </button>

        {import.meta.env.DEV && (
          <button
            type="button"
            className="bg-grey-800 text-grey-50 mt-10 rounded-lg px-6 py-3 text-body-2"
            onClick={handleDevLogin}
          >
            [DEV] 임시 로그인
          </button>
        )}
      </div>
    </MobileLayout>
  );
}
