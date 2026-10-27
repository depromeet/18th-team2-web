import { useMemo, useState } from 'react';

import letterImage from '@/assets/images/live-party/letter.png';
import CloseIcon from '@/assets/images/icons/close.svg?react';
import DownloadIcon from '@/assets/images/icons/download.svg?react';
import { CakeBackground } from '@/components/rolling-paper/CakeBackground';
import { CountdownTimer } from '@/components/rolling-paper/CountdownTimer';
import { ToppingGrid } from '@/components/rolling-paper/ToppingGrid';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { RefreshIcon } from '@/components/ui/icons/RefreshIcon';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { B1, H1 } from '@/components/ui/Typography';
import type { RollingPaperMessage } from '@/services/rolling-paper';
import { formatKoreanShortDate, parseKstDateTime } from '@/utils/date';

interface PaperOnlyRollingPaperHostViewProps {
  hostName?: string;
  messages?: RollingPaperMessage[];
  totalCount?: number;
  writableUntil?: string;
  isShareSheetOpen: boolean;
  inviteShareLink: string | null;
  isActivatingInvite: boolean;
  onShareClick: () => void;
  onShareSheetClose: () => void;
  onBackClick: () => void;
  onRefresh: () => void;
}

export function PaperOnlyRollingPaperHostView({
  hostName,
  messages = [],
  totalCount = messages.length,
  writableUntil,
  isShareSheetOpen,
  inviteShareLink,
  isActivatingInvite,
  onShareClick,
  onShareSheetClose,
  onBackClick,
  onRefresh,
}: PaperOnlyRollingPaperHostViewProps) {
  const [isShareNoticeOpen, setIsShareNoticeOpen] = useState(true);
  const hasMessages = totalCount > 0;
  const openDateLabel = useMemo(() => {
    if (!writableUntil) return null;
    const openDate = parseKstDateTime(writableUntil);
    return openDate.isValid() ? formatKoreanShortDate(openDate.toDate()) : null;
  }, [writableUntil]);

  return (
    <div
      className="bg-rolling-paper-main relative mx-auto h-dvh w-full max-w-150 overflow-hidden"
      style={{
        ['--rolling-paper-art-offset' as string]: 'clamp(-81px, calc(100dvh - 812px), 0px)',
        ['--rolling-paper-action-height' as string]: 'calc(172px + env(safe-area-inset-bottom))',
      }}
    >
      {hasMessages && <CakeBackground hideBottomDecoration />}

      <header className="pt-safe-top-3 relative z-30 flex items-center justify-between px-2">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={onBackClick}
          className="flex h-12 w-12 cursor-pointer items-center justify-center text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          type="button"
          aria-label="새로고침"
          onClick={onRefresh}
          className="flex h-12 w-12 cursor-pointer items-center justify-center text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          <RefreshIcon className="h-6 w-6" />
        </button>
      </header>

      <main className="absolute inset-x-0 top-[calc(72px+env(safe-area-inset-top))] bottom-[165px] z-20 flex flex-col px-4">
        {hasMessages ? (
          <div>
            <H1 className="font-semibold tracking-normal text-white">
              {hostName ? `${hostName}님의 롤링페이퍼` : '내 롤링페이퍼'}
            </H1>
            <B1 className="mt-2 text-blue-100">
              친구들이 총 <span className="font-medium text-white">{totalCount}</span>개의 편지를
              남겼어요!
              <br />
              롤링페이퍼는{' '}
              <span className="font-medium text-white">
                {openDateLabel ? `${openDateLabel} 밤 10시` : '마감일 밤 10시'}
              </span>
              에 공개돼요
            </B1>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-head-2 font-semibold tracking-normal text-white">
                아직 편지를 남긴 친구가 없어요
              </h1>
              <p className="text-body-2 mt-2 leading-[22px] font-medium text-blue-100">
                롤링페이퍼는{' '}
                <strong className="font-semibold text-white">
                  {openDateLabel ? `${openDateLabel} 밤 10시` : '마감일 밤 10시'}
                </strong>
                에 공개돼요
                <br />
                공개시간이 되면 확인할 수 있어요
              </p>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center pb-5">
              <img
                src={letterImage}
                alt=""
                className="drop-shadow-rolling-paper-empty w-[min(250px,68vw)] object-contain"
              />
            </div>
          </>
        )}
      </main>

      {hasMessages && (
        <ToppingGrid
          messages={messages}
          onToppingClick={() => undefined}
          hasBottomAction
          isInteractive={false}
        />
      )}

      {isShareNoticeOpen && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(109px+env(safe-area-inset-bottom))] z-40 flex justify-center px-4">
          <div
            role="status"
            className="pointer-events-auto flex h-[76px] w-[343px] max-w-full items-center justify-between rounded-[14px] bg-black/70 p-4 text-white"
          >
            <span aria-hidden="true" className="text-[34px] leading-none">
              🎉
            </span>
            <p className="text-body-2 mx-3 flex-1 leading-[22px] font-medium break-keep">
              친구들에게 공유하면
              <br />더 많은 축하를 받을 수 있어요!
            </p>
            <button
              type="button"
              aria-label="공유 안내 닫기"
              onClick={() => setIsShareNoticeOpen(false)}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      <section className="pb-safe-bottom-6 absolute right-0 bottom-0 left-0 z-20 bg-white px-4 pt-7">
        <div
          aria-hidden="true"
          className="absolute -top-[43px] left-1/2 h-[87px] w-[156%] min-w-[585px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(circle at 28px 44px, #FFFFFF 0 28px, transparent 29px) 0 0 / 57px 87px repeat-x',
          }}
        />

        <div className="relative mx-auto flex max-w-[343px] flex-col items-center gap-2">
          {writableUntil && (
            <CountdownTimer
              targetDate={writableUntil}
              className="text-grey-500 text-[15px] leading-[22px] font-medium"
              timeClassName="font-medium text-red-500"
            />
          )}

          <div className="flex w-full max-w-[340px] gap-2">
            <button
              type="button"
              aria-label="이미지 다운로드 기능 준비 중"
              title="이미지 다운로드 기능 준비 중"
              disabled
              className="border-grey-200 text-grey-900 flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border bg-white"
            >
              <DownloadIcon className="h-6 w-6" />
            </button>
            <div className="min-w-0 flex-1">
              <Button
                variant="primary"
                size="full"
                disabled={isActivatingInvite}
                onClick={onShareClick}
              >
                롤링페이퍼 공유하기
              </Button>
            </div>
          </div>
        </div>
      </section>

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
