import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { InquiryCard } from '@/components/mypage/InquiryCard';
import { LinkedAccountCard } from '@/components/mypage/LinkedAccountCard';
import { LogoutConfirmDialog } from '@/components/mypage/LogoutConfirmDialog';
import { LogoutRow } from '@/components/mypage/LogoutRow';
import { ErrorView } from '@/components/ui/ErrorView';
import { PageHeader } from '@/components/ui/PageHeader';
import { B2, H2 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import { useLogout, useMe } from '@/services/auth';
import { useMeAccount } from '@/services/me';
import { parseKstDateTime } from '@/utils/date';

export default function MyPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { data, isLoading, isError, refetch } = useMe();
  const userName = data?.data?.name;

  const {
    data: account,
    isLoading: isAccountLoading,
    isError: isAccountError,
    refetch: refetchAccount,
  } = useMeAccount();
  const parsedConnectedAt = account?.connectedAt ? parseKstDateTime(account.connectedAt) : null;
  const connectedAt = parsedConnectedAt?.isValid() ? parsedConnectedAt.format('YY.MM.DD') : '';

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleOpenLogoutDialog = () => setIsLogoutDialogOpen(true);
  const handleCloseLogoutDialog = () => setIsLogoutDialogOpen(false);
  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false);
    logout();
    navigate(ROUTES.home, { replace: true });
  };

  if (isError) {
    return (
      <ErrorView
        variant="retry"
        onPrimaryClick={() => void refetch()}
        onSecondaryClick={() => navigate(ROUTES.home, { replace: true })}
      />
    );
  }

  return (
    <div className="bg-grey-30 flex min-h-dvh flex-col">
      <PageHeader title="계정 관리" onBack={() => navigate(ROUTES.home, { replace: true })} />
      <section className="flex flex-col gap-3 px-4 pt-4 pb-3">
        {isLoading || !userName ? (
          <div className="bg-grey-100 h-7 w-24 animate-pulse rounded" />
        ) : (
          <H2 as="h2" className="text-black">
            {userName}
          </H2>
        )}
        <div className="flex flex-col gap-3">
          {account ? (
            <>
              <LinkedAccountCard provider="KAKAO" connectedAt={connectedAt} />
              {account.supportChatUrl && <InquiryCard openChatUrl={account.supportChatUrl} />}
            </>
          ) : isAccountLoading ? (
            <>
              <div className="bg-grey-100 h-12 animate-pulse rounded-xl" />
              <div className="bg-grey-100 h-32 animate-pulse rounded-xl" />
            </>
          ) : isAccountError ? (
            <div className="bg-grey-100 flex flex-col items-center gap-2 rounded-xl px-4 py-6">
              <B2 className="text-grey-500">계정 정보를 불러오지 못했어요.</B2>
              <button
                type="button"
                onClick={() => void refetchAccount()}
                className="text-label-1 cursor-pointer font-semibold text-blue-600 underline underline-offset-2"
              >
                다시 시도
              </button>
            </div>
          ) : null}
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
