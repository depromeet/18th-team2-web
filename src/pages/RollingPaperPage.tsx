import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';

import { CakeBackground } from '@/components/rolling-paper/CakeBackground';
import { CountdownTimer } from '@/components/rolling-paper/CountdownTimer';
import { RollingPaperLockedView } from '@/components/rolling-paper/RollingPaperLockedView';
import { MessageCard } from '@/components/message/MessageCard';
import { ToppingGrid } from '@/components/rolling-paper/ToppingGrid';
import { Button } from '@/components/ui/Button';
import { ErrorView } from '@/components/ui/ErrorView';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { LoginPromptSheet } from '@/components/ui/LoginPromptSheet';
import { H1, B1 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import { useActivateInviteLink } from '@/services/party-create';
import { useRollingPaper } from '@/services/rolling-paper';
import { HomeIcon } from '@/components/ui/icons/HomeIcon';
import { useAuthStore } from '@/stores/useAuthStore';
import { isApiErrorStatus } from '@/utils/api-error';
import { isFuture } from '@/utils/date';

const TOPPINGS_PER_PAGE = 7;

interface RollingPaperLocationState {
  mode?: 'write-complete';
  completeCta?: 'invite' | 'home';
  invitePath?: string;
  inviteToken?: string;
}

export default function RollingPaperPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as RollingPaperLocationState | null;
  const inviteToken = locationState?.inviteToken;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const requiresLogin = !inviteToken && !isAuthenticated;
  const { data, isLoading, isError, error, refetch } = useRollingPaper(
    id ?? '',
    inviteToken,
    1,
    !requiresLogin,
  );

  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [inviteShareLink, setInviteShareLink] = useState<string | null>(null);
  const { mutate: activateInviteLink, isPending: isActivatingInvite } = useActivateInviteLink();

  const isWritable = isFuture(data?.writableUntil);
  const isWriteCompleteMode = locationState?.mode === 'write-complete';
  const messages = data?.messages ?? [];
  const messageCount = messages.length;
  const initialToppingPage =
    isWriteCompleteMode && messageCount > 0 ? Math.ceil(messageCount / TOPPINGS_PER_PAGE) - 1 : 0;
  // BE 응답에 partyStartedAt이 없어 "파티 시작 전" 판정이 사실상 불가 → 기본 'home'.
  // 초대장으로 돌아가야 할 케이스는 호출부가 locationState.completeCta로 명시 지정.
  const completeCta = locationState?.completeCta ?? 'home';

  // 공유 버튼은 "롤링페이퍼 작성 권유"용이므로 조회 라우트가 아닌 초대 링크를 공유해야 한다.
  // 초대 토큰은 주최자만 발급 가능하며, 작성 가능 기간(isWritable)에만 버튼이 노출된다.
  function handleShareClick() {
    if (inviteShareLink) {
      setIsShareSheetOpen(true);
      return;
    }
    if (!id) return;

    activateInviteLink(Number(id), {
      onSuccess: (res) => {
        const token = res.data?.token;
        if (!token) return;
        setInviteShareLink(
          `${window.location.origin}${generatePath(ROUTES.partyInvite, { inviteToken: token })}`,
        );
        setIsShareSheetOpen(true);
      },
    });
  }

  useEffect(() => {
    if (requiresLogin) {
      useAuthStore.getState().setRedirectUrl(location.pathname);
    }
  }, [location.pathname, requiresLogin]);

  function handleCompleteAction() {
    if (completeCta === 'invite' && locationState?.invitePath) {
      navigate(locationState.invitePath, { replace: true, state: { rollingPaperWritten: true } });
      return;
    }

    if (completeCta === 'invite') {
      navigate(-1);
      return;
    }

    navigate(ROUTES.home, { replace: true });
  }

  // 작성 완료 화면에선 본인 외 메시지 열람 차단 — 토핑 클릭 무반응
  function handleToppingClick(index: number) {
    if (isWriteCompleteMode) return;
    setSelectedMessageIndex(index);
  }

  if (requiresLogin) {
    return (
      <LoginPromptSheet
        isOpen
        titlePrefix="롤링페이퍼를 확인하기 위해서는"
        onClose={() => navigate(-1)}
      />
    );
  }

  if (isLoading) return null;

  if (isError) {
    // 403: 권한 없음 또는 "아직 열람 불가"(롤페만 작성 파티의 조회 가능 시간 전).
    // 정상 진입한 화면이므로 권한 오류보다 "오픈 전" 케이스가 대부분 → 에러 대신 잠금 화면.
    if (isApiErrorStatus(error, 403)) {
      return <RollingPaperLockedView />;
    }

    if (isApiErrorStatus(error, 404)) {
      return <ErrorView variant="notFound" onPrimaryClick={() => navigate(ROUTES.home)} />;
    }

    return (
      <ErrorView
        variant="retry"
        onPrimaryClick={() => void refetch()}
        onSecondaryClick={() => navigate(-1)}
      />
    );
  }

  if (!data) return null;

  return (
    <>
      <div
        className="relative h-dvh overflow-hidden"
        style={{
          background: 'linear-gradient(179.96deg, #3342F3 0.03%, #5C8BFD 46.18%)',
          ['--rolling-paper-art-offset' as string]: 'clamp(-81px, calc(100dvh - 812px), 0px)',
        }}
      >
        {/* 케이크 배경 */}
        <CakeBackground />

        {/* 네비게이션 + 타이틀 */}
        {/* 홈 버튼은 프리런칭을 위한 임시 */}
        <div className="relative z-20 px-4 pt-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="뒤로가기"
              className="-ml-2 flex h-12 w-12 items-center justify-center"
            >
              <ChevronLeftIcon className="text-white" />
            </button>

            <button
              type="button"
              aria-label="메인으로"
              onClick={() => navigate(ROUTES.home)}
              className="flex h-12 w-12 items-center justify-center"
            >
              <HomeIcon />
            </button>
          </div>

          <H1 className="mt-5 font-semibold tracking-[-0.0002em] text-white">
            {isWriteCompleteMode
              ? '롤링페이퍼 작성이 완료되었어요'
              : `${data.hostName ?? ''}님의 롤링페이퍼`}
          </H1>
          <B1 className="mt-2 text-blue-100">
            {isWriteCompleteMode ? (
              '남겨주신 롤링페이퍼가 잘 저장되었어요.'
            ) : messageCount > 0 ? (
              <>
                총 <span className="font-medium text-white">{messageCount}</span>개의 메시지가
                도착했어요!
                <br />
                카드를 눌러 확인해보세요.
              </>
            ) : (
              <>
                아직 도착한 메시지가 없어요.
                <br />
                친구들에게 링크를 공유해 롤링페이퍼를 알려보세요!
              </>
            )}
          </B1>
        </div>

        {messageCount > 0 && (
          <ToppingGrid
            messages={messages}
            onToppingClick={handleToppingClick}
            initialPage={initialToppingPage}
          />
        )}

        {/* 하단 Action Area */}
        {isWriteCompleteMode ? (
          <div
            className="absolute right-0 bottom-0 left-0 z-20 flex flex-col items-center gap-2 px-4 pt-4 pb-12"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 40.91%)',
            }}
          >
            <Button variant="primary" size="full" onClick={handleCompleteAction}>
              {completeCta === 'invite' ? '초대장으로 돌아가기' : '홈으로'}
            </Button>
          </div>
        ) : isWritable ? (
          <div
            className="absolute right-0 bottom-0 left-0 z-20 flex flex-col items-center gap-2 px-4 pt-4 pb-12"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 40.91%)',
            }}
          >
            {data.writableUntil && <CountdownTimer targetDate={data.writableUntil} />}
            <Button
              variant="primary"
              size="full"
              disabled={isActivatingInvite}
              onClick={handleShareClick}
            >
              롤링페이퍼 공유하기
            </Button>
          </div>
        ) : null}

        {/* 공유 바텀시트 */}
        <LinkShareSheet
          isOpen={isShareSheetOpen}
          link={inviteShareLink ?? ''}
          title="롤링페이퍼 링크 공유하기"
          shareText="롤링페이퍼 작성 초대장이 왔어요"
          onClose={() => setIsShareSheetOpen(false)}
        />
      </div>

      {/* 메시지 확인 모달 — Portal로 전체 화면 dim */}
      {selectedMessageIndex !== null &&
        createPortal(
          <MessageCard
            partyId={data.partyId}
            messages={messages}
            initialIndex={selectedMessageIndex}
            onClose={() => setSelectedMessageIndex(null)}
          />,
          document.body,
        )}
    </>
  );
}
