import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';

import { CakeBackground } from '@/components/rolling-paper/CakeBackground';
import { CountdownTimer } from '@/components/rolling-paper/CountdownTimer';
import { MessageCard } from '@/components/message/MessageCard';
import { ToppingGrid } from '@/components/rolling-paper/ToppingGrid';
import { Button } from '@/components/ui/Button';
import { ErrorView } from '@/components/ui/ErrorView';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { H1, B1 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import { useRollingPaper, type RollingPaperMessage } from '@/services/rolling-paper';
import { HomeIcon } from '@/components/ui/icons/HomeIcon';
import { isApiErrorStatus } from '@/utils/api-error';
import { isFuture } from '@/utils/date';

const TOPPINGS_PER_PAGE = 7;

interface RollingPaperLocationState {
  mode?: 'write-complete';
  completeCta?: 'invite' | 'home';
  completedMessage?: RollingPaperMessage;
  invitePath?: string;
  inviteToken?: string;
}

export default function RollingPaperPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as RollingPaperLocationState | null;
  const inviteToken = locationState?.inviteToken;
  const { data, isLoading, isError, error, refetch } = useRollingPaper(id ?? '', inviteToken);

  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  const isWritable = isFuture(data?.writableUntil);
  const isWriteCompleteMode = locationState?.mode === 'write-complete';
  const messages = useMemo(() => {
    if (!data) return [];
    if (!locationState?.completedMessage) return data.messages;
    const hasCompletedMessage = data.messages.some(
      (message) => message.id === locationState.completedMessage?.id,
    );

    return hasCompletedMessage ? data.messages : [...data.messages, locationState.completedMessage];
  }, [data, locationState?.completedMessage]);
  const messageCount = messages.length;
  const initialToppingPage =
    isWriteCompleteMode && messageCount > 0 ? Math.ceil(messageCount / TOPPINGS_PER_PAGE) - 1 : 0;
  // BE 응답에 partyStartedAt이 없어 "파티 시작 전" 판정이 사실상 불가 → 기본 'home'.
  // 초대장으로 돌아가야 할 케이스는 호출부가 locationState.completeCta로 명시 지정.
  const completeCta = locationState?.completeCta ?? 'home';

  const shareLink = useMemo(
    () => `${window.location.origin}${generatePath(ROUTES.rollingPaper, { id: id ?? '' })}`,
    [id],
  );

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

  if (isLoading) return null;

  if (isError) {
    if (isApiErrorStatus(error, 404) || isApiErrorStatus(error, 403)) {
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
            <Button variant="primary" size="full" onClick={() => setIsShareSheetOpen(true)}>
              롤링페이퍼 공유하기
            </Button>
          </div>
        ) : null}

        {/* 공유 바텀시트 */}
        <LinkShareSheet
          isOpen={isShareSheetOpen}
          link={shareLink}
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
