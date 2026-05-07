import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';

import { CakeBackground } from '@/components/rolling-paper/CakeBackground';
import { CountdownTimer } from '@/components/rolling-paper/CountdownTimer';
import { MessageCard } from '@/components/message/MessageCard';
import { ToppingGrid } from '@/components/rolling-paper/ToppingGrid';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { H1, B1 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import { useRollingPaper, type RollingPaperMessage } from '@/services/rolling-paper';

const TOPPINGS_PER_PAGE = 7;

interface RollingPaperLocationState {
  mode?: 'write-complete';
  completeCta?: 'invite' | 'home';
  completedMessage?: RollingPaperMessage;
  invitePath?: string;
}

export default function RollingPaperPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as RollingPaperLocationState | null;
  const { data } = useRollingPaper(id ?? '');

  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  const isWritable = data ? new Date(data.writableUntil).getTime() > Date.now() : false;
  const isBeforeParty = data ? new Date(data.partyStartedAt).getTime() > Date.now() : false;
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
  const completeCta = locationState?.completeCta ?? (isBeforeParty ? 'invite' : 'home');

  const shareLink = useMemo(
    () => `${window.location.origin}${generatePath(ROUTES.rollingPaper, { id: id ?? '' })}`,
    [id],
  );

  function handleCompleteAction() {
    if (completeCta === 'invite' && locationState?.invitePath) {
      navigate(locationState.invitePath, { replace: true });
      return;
    }

    if (completeCta === 'invite') {
      navigate(-1);
      return;
    }

    navigate(ROUTES.home, { replace: true });
  }

  if (!data) return null;

  return (
    <>
      <div
        className="relative flex min-h-dvh flex-col overflow-hidden"
        style={{ background: 'linear-gradient(179.96deg, #3342F3 0.03%, #5C8BFD 46.18%)' }}
      >
        {/* 케이크 배경 */}
        <CakeBackground />

        {/* 네비게이션 + 타이틀 */}
        <div className="relative z-20 px-4 pt-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="-ml-2 flex h-12 w-12 cursor-pointer items-center justify-center"
          >
            <ChevronLeftIcon className="text-white" />
          </button>

          <H1 className="mt-5 font-semibold tracking-[-0.0002em] text-white">
            {isWriteCompleteMode
              ? '롤링페이퍼 작성이 완료되었어요'
              : `${data.hostName}님의 롤링페이퍼`}
          </H1>
          <B1 className="mt-2 font-medium text-blue-100">
            {isWriteCompleteMode ? (
              '남겨주신 롤링페이퍼가 잘 저장되었어요.'
            ) : messageCount > 0 ? (
              <>
                총 {messageCount}개의 메시지가 도착했어요!
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

        {/* 토핑 영역 — flex-1로 남은 공간 채움 */}
        {messageCount > 0 ? (
          <ToppingGrid
            messages={messages}
            onToppingClick={(index) => setSelectedMessageIndex(index)}
            initialPage={initialToppingPage}
          />
        ) : (
          <div className="flex-1" />
        )}

        {/* 하단 Action Area */}
        {isWriteCompleteMode ? (
          <div
            className="relative z-20 flex flex-col items-center gap-2 px-4 pt-4 pb-8"
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
            className="relative z-20 flex flex-col items-center gap-2 px-4 pt-4 pb-8"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 40.91%)',
            }}
          >
            <CountdownTimer targetDate={data.writableUntil} />
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
          shareText="롤링페이퍼가 도착했어요"
          onClose={() => setIsShareSheetOpen(false)}
        />
      </div>

      {/* 메시지 확인 모달 — Portal로 전체 화면 dim */}
      {selectedMessageIndex !== null &&
        createPortal(
          <MessageCard
            messages={messages}
            initialIndex={selectedMessageIndex}
            onClose={() => setSelectedMessageIndex(null)}
          />,
          document.body,
        )}
    </>
  );
}
