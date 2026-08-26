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
import letterImage from '@/assets/images/live-party/letter.png';
import { ROUTES } from '@/constants/routes';
import { useActivateInviteLink } from '@/services/party-create';
import { useRollingPaper } from '@/services/rolling-paper';
import { HomeIcon } from '@/components/ui/icons/HomeIcon';
import { useAuthStore } from '@/stores/useAuthStore';
import { isApiErrorStatus } from '@/utils/api-error';
import { isFuture } from '@/utils/date';

interface RollingPaperLocationState {
  mode?: 'write-complete';
  completeCta?: 'invite' | 'home';
  invitePath?: string;
  inviteToken?: string;
}

function formatArchiveNoticeDate(writableUntil?: string) {
  if (!writableUntil) return undefined;

  const date = new Date(writableUntil);
  if (Number.isNaN(date.getTime())) return undefined;

  date.setDate(date.getDate() - 7);
  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
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
  // BE 응답에 partyStartedAt이 없어 "파티 시작 전" 판정이 사실상 불가 → 기본 'home'.
  // 초대장으로 돌아가야 할 케이스는 호출부가 locationState.completeCta로 명시 지정.
  const completeCta = locationState?.completeCta ?? 'home';
  const showHostShareAction = !inviteToken && !isWriteCompleteMode && isWritable;

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

  function handleHomeClick() {
    if (!inviteToken && !isWriteCompleteMode && messageCount > 0 && data) {
      navigate(ROUTES.home, {
        state: {
          rollingPaperArchiveNotice: {
            partyId: data.partyId,
            partyName: `${data.hostName ?? '내'}의 파티`,
            date: formatArchiveNoticeDate(data.writableUntil),
          },
        },
      });
      return;
    }

    navigate(ROUTES.home);
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

  if (!inviteToken && !isWriteCompleteMode && messageCount === 0 && isWritable) {
    return (
      <EmptyRollingPaperHostView
        writableUntil={data.writableUntil}
        isShareSheetOpen={isShareSheetOpen}
        inviteShareLink={inviteShareLink}
        isActivatingInvite={isActivatingInvite}
        onShareClick={handleShareClick}
        onShareSheetClose={() => setIsShareSheetOpen(false)}
        onHomeClick={() => navigate(ROUTES.home)}
      />
    );
  }

  return (
    <>
      <div
        className="relative h-dvh overflow-hidden"
        style={{
          background: 'linear-gradient(179.96deg, #3342F3 0.03%, #5C8BFD 46.18%)',
          ['--rolling-paper-art-offset' as string]: 'clamp(-81px, calc(100dvh - 812px), 0px)',
          ['--rolling-paper-action-height' as string]: 'calc(172px + env(safe-area-inset-bottom))',
        }}
      >
        {/* 케이크 배경 */}
        <CakeBackground hideBottomDecoration={showHostShareAction} />

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
              onClick={handleHomeClick}
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
                총 <span className="font-medium text-white">{messageCount}</span>개의 편지가
                도착했어요!
                <br />
                토핑을 눌러 확인해 보세요
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
            hasBottomAction={showHostShareAction}
          />
        )}

        {/* 하단 Action Area */}
        {isWriteCompleteMode ? (
          <div
            className="absolute right-0 bottom-0 left-0 z-20 flex flex-col items-center gap-2 px-4 pt-4 pb-[calc(48px+env(safe-area-inset-bottom))]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 40.91%)',
            }}
          >
            <Button variant="primary" size="full" onClick={handleCompleteAction}>
              {completeCta === 'invite' ? '초대장으로 돌아가기' : '홈으로'}
            </Button>
          </div>
        ) : showHostShareAction ? (
          <RollingPaperShareActionArea
            writableUntil={data.writableUntil}
            isActivatingInvite={isActivatingInvite}
            onShareClick={handleShareClick}
            variant="solid"
            animate
          />
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

interface EmptyRollingPaperHostViewProps {
  writableUntil?: string;
  isShareSheetOpen: boolean;
  inviteShareLink: string | null;
  isActivatingInvite: boolean;
  onShareClick: () => void;
  onShareSheetClose: () => void;
  onHomeClick: () => void;
}

function EmptyRollingPaperHostView({
  writableUntil,
  isShareSheetOpen,
  inviteShareLink,
  isActivatingInvite,
  onShareClick,
  onShareSheetClose,
  onHomeClick,
}: EmptyRollingPaperHostViewProps) {
  return (
    <div
      className="relative mx-auto h-dvh w-full max-w-150 overflow-hidden"
      style={{
        background: 'linear-gradient(179.96deg, #3342F3 0.03%, #5C8BFD 46.18%)',
      }}
    >
      <div className="relative z-20 flex justify-end px-4 pt-[calc(12px+env(safe-area-inset-top))]">
        <button
          type="button"
          aria-label="메인으로"
          onClick={onHomeClick}
          className="flex h-12 w-12 items-center justify-center text-white"
        >
          <HomeIcon className="h-6 w-6" />
        </button>
      </div>

      <main className="absolute inset-x-0 top-[calc(clamp(88px,12.7dvh,103px)+env(safe-area-inset-top))] bottom-[180px] z-10 flex flex-col items-center px-4 pt-[clamp(36px,7.4dvh,60px)] text-center [@media_(max-height:700px)]:bottom-[164px] [@media_(max-height:700px)]:pt-8">
        <img
          src={letterImage}
          alt=""
          className="max-h-[34dvh] w-[min(280px,72vw)] shrink-0 object-contain drop-shadow-[0_18px_28px_rgba(0,32,120,0.18)] [@media_(max-height:700px)]:w-[min(220px,64vw)]"
        />

        <div className="mt-[clamp(28px,4.9dvh,40px)] flex flex-col items-center gap-4 [@media_(max-height:700px)]:gap-3">
          <h1 className="text-head-2 font-bold tracking-[-0.01px] text-white">
            아직 편지를 남긴 친구가 없어요
          </h1>
          <p className="text-body-1 leading-6 font-medium whitespace-pre-line text-blue-100">
            {'친구들에게 링크를 공유해\n롤링페이퍼를 알려보세요!'}
          </p>
        </div>
      </main>

      <RollingPaperShareActionArea
        writableUntil={writableUntil}
        isActivatingInvite={isActivatingInvite}
        onShareClick={onShareClick}
        variant="solid"
      />

      <LinkShareSheet
        isOpen={isShareSheetOpen}
        link={inviteShareLink ?? ''}
        title="롤링페이퍼 링크 공유하기"
        shareText="롤링페이퍼 작성 초대장이 왔어요"
        onClose={onShareSheetClose}
      />
    </div>
  );
}

interface RollingPaperShareActionAreaProps {
  writableUntil?: string;
  isActivatingInvite: boolean;
  onShareClick: () => void;
  variant?: 'gradient' | 'solid';
  animate?: boolean;
}

function RollingPaperShareActionArea({
  writableUntil,
  isActivatingInvite,
  onShareClick,
  variant = 'gradient',
  animate = false,
}: RollingPaperShareActionAreaProps) {
  const tooltipBubbleClassName = [
    'relative flex w-fit max-w-[calc(100vw-28px)] items-center justify-center rounded-xl bg-[#000341] px-3 py-2',
    animate ? 'rolling-paper-share-tooltip' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const actionPanelClassName = [
    'absolute right-0 bottom-0 left-0 z-20 px-4 pt-13 pb-[calc(34px+env(safe-area-inset-bottom))] [@media_(max-height:700px)]:pt-11 [@media_(max-height:700px)]:pb-[calc(24px+env(safe-area-inset-bottom))]',
    variant === 'solid'
      ? 'bg-white'
      : 'bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_40.91%)]',
    animate ? 'rolling-paper-action-panel' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={actionPanelClassName}>
      {variant === 'solid' && (
        <div
          aria-hidden
          className="absolute -top-[43px] left-1/2 h-[87px] w-[156%] min-w-[585px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(circle at 28px 44px, #FFFFFF 0 28px, transparent 29px) 0 0 / 57px 87px repeat-x',
          }}
        />
      )}

      <div className="absolute top-[18px] left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
        <div className={tooltipBubbleClassName}>
          <p className="text-label-1 text-center whitespace-nowrap text-white [@media_(max-width:350px)]:text-[12px] [@media_(max-width:380px)]:text-[13px]">
            공유하고 더 많은 친구들에게 편지를 받아보세요
          </p>
          <span
            aria-hidden
            className="absolute bottom-[-7px] left-4 h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-[#000341]"
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-[343px] flex-col items-center gap-2">
        {writableUntil && (
          <CountdownTimer
            targetDate={writableUntil}
            className="text-body-2 text-grey-500 text-center font-medium"
            timeClassName="font-semibold text-red-500"
          />
        )}
        <Button variant="primary" size="full" disabled={isActivatingInvite} onClick={onShareClick}>
          롤링페이퍼 공유하기
        </Button>
      </div>
    </section>
  );
}
