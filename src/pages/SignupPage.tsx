import { useNavigate } from 'react-router-dom';

import { MobileLayout } from '@/components/layout/MobileLayout';

export function SignupPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex min-h-dvh flex-col items-center justify-center px-5">
        <h1 className="text-t2 font-bold">회원가입</h1>
        <p className="text-grey-300 mt-2 text-b2">회원가입 페이지 (Figma 연동 후 구현 예정)</p>
        <button
          type="button"
          className="mt-6 text-blue-300 underline"
          onClick={() => navigate('/login')}
        >
          로그인으로 이동
        </button>
      </div>
    </MobileLayout>
  );
}
