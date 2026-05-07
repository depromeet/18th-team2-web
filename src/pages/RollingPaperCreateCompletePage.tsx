import { useMemo, useState } from 'react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';

import homeIcon from '@/assets/icons/icon-home.svg';
import { CompletedRollingPaperCard } from '@/components/party-create/CompletedRollingPaperCard';
import { Button } from '@/components/ui/Button';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { B1, H1 } from '@/components/ui/Typography';
import { DUMMY_HOST_NAME, ROLLING_PAPER_DURATION_DAYS } from '@/constants/partyCreate';
import { ROUTES } from '@/constants/routes';
import { addDays, formatKoreanShortDate, getTodayMidnight } from '@/utils/date';
const ROLLING_PAPER_OPEN_TIME = '오후 10시';

interface RollingPaperCompleteState {
  hostName?: string;
  startDate?: string;
  endDate?: string;
}

function getRollingPaperCompleteState(state: unknown): RollingPaperCompleteState {
  if (!state || typeof state !== 'object') return {};
  return state as RollingPaperCompleteState;
}

export default function RollingPaperCreateCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const rollingPaperState = getRollingPaperCompleteState(location.state);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  const hostName = rollingPaperState.hostName ?? DUMMY_HOST_NAME;
  const startDate = rollingPaperState.startDate
    ? new Date(rollingPaperState.startDate)
    : getTodayMidnight();
  const endDate = rollingPaperState.endDate
    ? new Date(rollingPaperState.endDate)
    : addDays(startDate, ROLLING_PAPER_DURATION_DAYS);
  const openDateLabel = formatKoreanShortDate(startDate);

  // TODO: 생성 API 응답의 partyId/rollingPaperId 기준 실제 공유 링크로 교체
  const shareLink = useMemo(
    () =>
      `${window.location.origin}${generatePath(ROUTES.rollingPaper, { id: 'mock-rolling-paper-id' })}`,
    [],
  );

  return (
    <div className="party-complete-page relative flex min-h-screen flex-col overflow-hidden px-5">
      <header className="flex justify-end pt-16">
        <button
          type="button"
          onClick={() => navigate(ROUTES.home)}
          aria-label="홈으로 이동"
          className="flex h-10 w-10 items-center justify-center"
        >
          <img src={homeIcon} alt="" className="h-6 w-6 opacity-20" />
        </button>
      </header>

      <div className="relative mt-10 min-h-18">
        <H1 className="rolling-paper-complete-title text-center">롤링페이퍼가 완성되었어요</H1>
        <H1 className="rolling-paper-complete-open-title absolute inset-x-0 top-0 text-center">
          {openDateLabel} {ROLLING_PAPER_OPEN_TIME}부터
          <br />
          받은 롤링페이퍼를 확인할 수 있어요
        </H1>
      </div>

      <div className="mx-auto mt-7 flex w-full max-w-[343px] flex-1 flex-col">
        <CompletedRollingPaperCard
          className="party-complete-card"
          hostName={hostName}
          startDate={startDate}
          endDate={endDate}
        />

        <B1 className="party-complete-notice mt-3 font-medium text-white">
          * 파티 시작 24시간 전까지 수정할 수 있어요
        </B1>

        <div className="party-complete-button mt-auto pb-6">
          <Button variant="white" size="full" onClick={() => setIsShareSheetOpen(true)}>
            링크 공유하기
          </Button>
        </div>
      </div>

      <LinkShareSheet
        isOpen={isShareSheetOpen}
        link={shareLink}
        title="롤링페이퍼 링크 공유하기"
        shareText="롤링페이퍼 작성 초대장이 왔어요"
        onClose={() => setIsShareSheetOpen(false)}
      />
    </div>
  );
}
