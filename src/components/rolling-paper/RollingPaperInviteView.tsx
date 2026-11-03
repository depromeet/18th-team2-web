import { useLocation, useNavigate } from 'react-router-dom';

import letterImage from '@/assets/images/live-party/letter.png';
import { CakeBackground } from '@/components/rolling-paper/CakeBackground';
import { RollingPaperShareActionArea } from '@/components/rolling-paper/RollingPaperShareActionArea';
import { ToppingGrid } from '@/components/rolling-paper/ToppingGrid';
import { ErrorView } from '@/components/ui/ErrorView';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { RefreshIcon } from '@/components/ui/icons/RefreshIcon';
import { B1, H1 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import { useRollingPaper } from '@/services/rolling-paper';
import { isApiErrorStatus } from '@/utils/api-error';
import {
  buildRollingPaperWritePath,
  saveRollingPaperWriteContext,
} from '@/utils/rollingPaperWrite';

interface RollingPaperInviteViewProps {
  partyId: string;
  inviteToken: string;
  hostName: string;
  writableUntil?: string;
  onWritingExpired?: () => void;
}

export function RollingPaperInviteView({
  partyId,
  inviteToken,
  hostName,
  writableUntil,
  onWritingExpired,
}: RollingPaperInviteViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, isError, error, refetch } = useRollingPaper(partyId, inviteToken, true);
  const messages = data?.messages ?? [];
  const displayName = hostName || '주인공';

  function handleWriteClick() {
    const writeContext = {
      completeCta: 'invite' as const,
      invitePath: location.pathname,
      inviteToken,
      hostName: displayName,
    };

    saveRollingPaperWriteContext(partyId, writeContext);
    navigate(buildRollingPaperWritePath(partyId, inviteToken), { state: writeContext });
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

  return (
    <div className="rolling-paper-scene-vars bg-rolling-paper-main relative mx-auto h-dvh w-full max-w-150 overflow-hidden">
      {messages.length > 0 && <CakeBackground hideBottomDecoration />}

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
            aria-label="새로고침"
            onClick={() => void refetch()}
            className="flex h-12 w-12 cursor-pointer items-center justify-center text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <RefreshIcon className="h-6 w-6" />
          </button>
        </div>

        <H1 className="mt-5 font-semibold tracking-normal text-white">
          {displayName}님을 위해
          <br />
          롤링페이퍼를 작성해 주세요!
        </H1>
        <B1 className="mt-2 text-blue-100">
          {messages.length === 0 ? (
            '가장 처음으로 마음을 남겨보세요'
          ) : (
            <>
              친구들이 총{' '}
              <span className="font-semibold text-white">
                {data?.totalCount ?? messages.length}개
              </span>
              의 편지를 남겼어요!
            </>
          )}
        </B1>
      </div>

      {messages.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-[235px] bottom-[143px] z-10 flex items-center justify-center">
          <img
            src={letterImage}
            alt=""
            className="drop-shadow-rolling-paper-empty max-h-full w-[min(250px,68vw)] object-contain"
          />
        </div>
      )}

      {messages.length > 0 && (
        <ToppingGrid
          messages={messages}
          onToppingClick={() => undefined}
          hasBottomAction
          isInteractive={false}
        />
      )}

      <RollingPaperShareActionArea
        writableUntil={writableUntil}
        isActivatingInvite={false}
        onShareClick={handleWriteClick}
        variant="solid"
        buttonLabel="롤링페이퍼 남기기"
        showTooltip={false}
        onWritingExpired={onWritingExpired}
      />
    </div>
  );
}
