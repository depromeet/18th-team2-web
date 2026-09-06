import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import shareIcon from '@/assets/icons/icon-share.svg';
import { CakeBackground } from '@/components/rolling-paper/CakeBackground';
import { RollingPaperShareActionArea } from '@/components/rolling-paper/RollingPaperShareActionArea';
import { ToppingGrid } from '@/components/rolling-paper/ToppingGrid';
import { ErrorView } from '@/components/ui/ErrorView';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
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
}

export function RollingPaperInviteView({
  partyId,
  inviteToken,
  hostName,
  writableUntil,
}: RollingPaperInviteViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const { data, isLoading, isError, error, refetch } = useRollingPaper(partyId, inviteToken, true);
  const messages = data?.messages ?? [];
  const displayName = hostName || '주인공';
  const inviteLink =
    typeof window === 'undefined'
      ? location.pathname
      : `${window.location.origin}${location.pathname}`;

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
    <div
      className="relative mx-auto h-dvh w-full max-w-150 overflow-hidden"
      style={{
        background: 'linear-gradient(179.96deg, #3342F3 0.03%, #5C8BFD 46.18%)',
        ['--rolling-paper-art-offset' as string]: 'clamp(-81px, calc(100dvh - 812px), 0px)',
        ['--rolling-paper-action-height' as string]: 'calc(172px + env(safe-area-inset-bottom))',
      }}
    >
      <CakeBackground hideBottomDecoration />

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
            onClick={() => setIsShareSheetOpen(true)}
            className="text-label-1 inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-black/70 px-3 font-semibold text-white"
          >
            <img src={shareIcon} alt="" className="h-5 w-5" />
            공유하기
          </button>
        </div>

        <H1 className="mt-5 font-semibold tracking-[-0.0002em] text-white">
          {displayName}님의 롤링페이퍼
        </H1>
        <B1 className="mt-2 text-blue-100">
          롤링페이퍼로 축하를 남겨보세요!
          <br />
          작성한 내용은 주인공만 볼 수 있어요
        </B1>
      </div>

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
        buttonLabel="롤링페이퍼 작성하기"
        showTooltip={false}
      />

      <LinkShareSheet
        isOpen={isShareSheetOpen}
        link={inviteLink}
        title="롤링페이퍼 링크 공유하기"
        shareText="롤링페이퍼 작성 초대장이 왔어요"
        onClose={() => setIsShareSheetOpen(false)}
      />
    </div>
  );
}
