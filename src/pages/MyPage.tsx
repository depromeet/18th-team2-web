import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { InquiryCard } from '@/components/mypage/InquiryCard';
import { LinkedAccountCard } from '@/components/mypage/LinkedAccountCard';
import { LogoutConfirmDialog } from '@/components/mypage/LogoutConfirmDialog';
import { LogoutRow } from '@/components/mypage/LogoutRow';
import { PageHeader } from '@/components/ui/PageHeader';
import { H2 } from '@/components/ui/Typography';
import { EXTERNAL_URLS } from '@/constants/external-urls';
import { ROUTES } from '@/constants/routes';
import { useLogout, useMe } from '@/services/auth';

// TODO: BE에서 카카오 연결 일자 제공 시 교체
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
      <PageHeader title="계정 관리" />
      <section className="flex flex-col gap-3 px-4 pt-4 pb-3">
        {isLoading || !userName ? (
          <div className="bg-grey-100 h-7 w-24 animate-pulse rounded" />
        ) : (
          <H2 as="h2" className="text-black">
            {userName}
          </H2>
        )}
        <div className="flex flex-col gap-3">
          <LinkedAccountCard provider="KAKAO" connectedAt={MOCK_CONNECTED_AT} />
          <InquiryCard openChatUrl={EXTERNAL_URLS.KAKAO_OPEN_CHAT} />
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
