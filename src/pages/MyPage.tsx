import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { InquiryCard } from '@/components/mypage/InquiryCard';
import { LinkedAccountCard } from '@/components/mypage/LinkedAccountCard';
import { LogoutConfirmDialog } from '@/components/mypage/LogoutConfirmDialog';
import { LogoutRow } from '@/components/mypage/LogoutRow';
import { MyPageHeader } from '@/components/mypage/MyPageHeader';
import { H2 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import { useLogout, useMe } from '@/services/auth';

// TODO: BE에서 카카오 연결 일자/오픈채팅 URL 제공 시 교체
const KAKAO_OPEN_CHAT_URL = 'https://open.kakao.com/';
const MOCK_CONNECTED_AT = '26.02.23';

export default function MyPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { data, isLoading } = useMe();
  const userName = data?.data?.name;

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleOpenLogoutDialog = () => setIsLogoutDialogOpen(true);
  const handleCloseLogoutDialog = () => setIsLogoutDialogOpen(false);
  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false);
    logout();
    navigate(ROUTES.home, { replace: true });
  };

  return (
    <div className="bg-grey-30 flex min-h-screen flex-col">
      <MyPageHeader />
      <section className="flex flex-col gap-3 px-4 pt-4 pb-3">
        {isLoading || !userName ? (
          <div className="bg-grey-100 h-7 w-24 animate-pulse rounded" />
        ) : (
          <H2 as="h1" className="text-black">
            {userName}
          </H2>
        )}
        <div className="flex flex-col gap-3">
          <LinkedAccountCard provider="KAKAO" connectedAt={MOCK_CONNECTED_AT} />
          <InquiryCard openChatUrl={KAKAO_OPEN_CHAT_URL} />
          <LogoutRow onClick={handleOpenLogoutDialog} />
        </div>
      </section>

      <LogoutConfirmDialog
        isOpen={isLogoutDialogOpen}
        onCancel={handleCloseLogoutDialog}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
