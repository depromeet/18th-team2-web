import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '@/components/layout/MobileLayout';
import { CakeBackground } from '@/components/rolling-paper/CakeBackground';
import { CountdownTimer } from '@/components/rolling-paper/CountdownTimer';
import { MessageCard } from '@/components/rolling-paper/MessageCard';
import { ToppingGrid } from '@/components/rolling-paper/ToppingGrid';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { H1, B1 } from '@/components/ui/Typography';
import { ROUTES, buildRollingPaperPath } from '@/constants/routes';
import { useRollingPaper } from '@/services/rolling-paper';

export default function RollingPaperPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useRollingPaper(id ?? '');

  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  const isWritable = data ? new Date(data.writableUntil).getTime() > Date.now() : false;
  const messageCount = data?.messages.length ?? 0;

  const shareLink = useMemo(
    () => `${window.location.origin}${buildRollingPaperPath(id ?? '')}`,
    [id],
  );

  if (!data) return null;

  return (
    <MobileLayout>
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
            onClick={() => navigate(ROUTES.home)}
            aria-label="뒤로가기"
            className="-ml-2 flex h-12 w-12 items-center justify-center"
          >
            <ChevronLeftIcon className="text-white" />
          </button>

          <H1 className="mt-5 font-semibold tracking-[-0.0002em] text-white">
            {data.hostName}님의 롤링페이퍼
          </H1>
          <B1 className="mt-2 font-medium text-blue-100">
            {messageCount > 0 ? (
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
            messages={data.messages}
            onToppingClick={(index) => setSelectedMessageIndex(index)}
          />
        ) : (
          <div className="flex-1" />
        )}

        {/* 하단 Action Area */}
        {isWritable && (
          <div
            className="relative z-20 flex flex-col items-center gap-2 pt-4 pb-8"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 40.91%)' }}
          >
            <CountdownTimer targetDate={data.writableUntil} />
            <Button variant="primary" size="full" onClick={() => setIsShareSheetOpen(true)}>
              롤링페이퍼 공유하기
            </Button>
          </div>
        )}

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
            messages={data.messages}
            initialIndex={selectedMessageIndex}
            onClose={() => setSelectedMessageIndex(null)}
          />,
          document.body,
        )}
    </MobileLayout>
  );
}
