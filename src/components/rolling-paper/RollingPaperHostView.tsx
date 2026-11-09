import { useEffect, useMemo, useRef, useState } from 'react';

import letterImage from '@/assets/images/live-party/letter.png';
import { CakeBackground } from '@/components/rolling-paper/CakeBackground';
import { RollingPaperEmptyCaptureView } from '@/components/rolling-paper/RollingPaperEmptyCaptureView';
import { RollingPaperHeader } from '@/components/rolling-paper/RollingPaperHeader';
import { RollingPaperShareActionArea } from '@/components/rolling-paper/RollingPaperShareActionArea';
import { RollingPaperShareNotice } from '@/components/rolling-paper/RollingPaperShareNotice';
import { ToppingGrid } from '@/components/rolling-paper/ToppingGrid';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { B1, H1 } from '@/components/ui/Typography';
import { useRollingPaperShare } from '@/hooks/rolling-paper/useRollingPaperShare';
import type { RollingPaperData } from '@/services/rolling-paper';
import { formatKoreanShortDate, isFuture, parseKstDateTime } from '@/utils/date';
import { ImageDownloadButton } from '@/components/rolling-paper/ImageDownloadButton';

interface RollingPaperHostViewProps {
  partyType?: 'paper-only' | 'realtime';
  data: RollingPaperData;
  fallbackHostName?: string;
  onBackClick: () => void;
  onRefresh: () => void;
  onToppingClick?: (index: number) => void;
}

export function RollingPaperHostView({
  partyType = 'paper-only',
  data,
  fallbackHostName,
  onBackClick,
  onRefresh,
  onToppingClick,
}: RollingPaperHostViewProps) {
  const { messages, totalCount, viewableAt, writableUntil } = data;
  const hostName = data.hostName ?? fallbackHostName;
  const isViewable = data.viewable !== false;
  const captureTargetRef = useRef<HTMLDivElement>(null);
  const emptyCaptureTargetRef = useRef<HTMLDivElement>(null);
  const [hasWritableTime, setHasWritableTime] = useState(() => isFuture(writableUntil));
  const { isShareSheetOpen, inviteShareLink, isActivatingInvite, openShareSheet, closeShareSheet } =
    useRollingPaperShare(data.partyId);
  const hasMessages = totalCount > 0;
  const isRealtimeParty = partyType === 'realtime';
  const showShareControls = hasWritableTime;
  const openDateLabel = useMemo(() => {
    if (!viewableAt) return null;
    const openDate = parseKstDateTime(viewableAt);
    return openDate.isValid() ? formatKoreanShortDate(openDate.toDate()) : null;
  }, [viewableAt]);
  const writableDateLabel = useMemo(() => {
    if (!writableUntil) return null;
    const writableDate = parseKstDateTime(writableUntil);
    return writableDate.isValid() ? formatKoreanShortDate(writableDate.toDate()) : null;
  }, [writableUntil]);

  useEffect(() => {
    setHasWritableTime(isFuture(writableUntil));
  }, [writableUntil]);

  return (
    <div
      ref={captureTargetRef}
      className="bg-rolling-paper-main relative mx-auto h-dvh w-full max-w-150 overflow-hidden"
      style={{
        ['--rolling-paper-art-offset' as string]: 'clamp(-81px, calc(100dvh - 812px), 0px)',
        ['--rolling-paper-action-height' as string]: 'calc(172px + env(safe-area-inset-bottom))',
      }}
    >
      {hasMessages && <CakeBackground hideBottomDecoration={showShareControls} />}

      <div data-capture-hidden>
        <RollingPaperHeader onBack={onBackClick} onRefresh={onRefresh} />
      </div>

      <main
        className={`pointer-events-none absolute inset-x-0 top-[calc(72px+env(safe-area-inset-top))] z-20 flex flex-col px-4 ${showShareControls ? 'bottom-[165px]' : 'bottom-0'}`}
      >
        {hasMessages ? (
          <div>
            <H1 className="font-semibold tracking-normal text-white">
              <>
                {hostName ? `${hostName}님을 위해` : '나를 위해'}
                <br />
                롤링페이퍼를 작성해 주세요!
              </>
            </H1>
            <B1 className="mt-2 text-blue-100">
              친구들이 총 <span className="font-medium text-white">{totalCount}</span>개의 편지를
              남겼어요!
              {isViewable && !isRealtimeParty && (
                <span data-capture-hidden>
                  <br />
                  토핑을 눌러 확인해 보세요!
                </span>
              )}
            </B1>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-head-2 font-semibold tracking-normal text-white">
                {isRealtimeParty ? (
                  '아직 편지를 남긴 친구가 없어요'
                ) : (
                  <>
                    {hostName ? `${hostName}님을 위해` : '나를 위해'}
                    <br />
                    롤링페이퍼를 작성해 주세요!
                  </>
                )}
              </h1>
              <p className="text-body-2 mt-2 leading-[22px] font-medium text-blue-100">
                {isRealtimeParty ? (
                  <>
                    링크를 공유해 친구들에게 알려보세요!
                    <br />
                    롤링페이퍼는{' '}
                    <strong className="font-semibold text-white">
                      {writableDateLabel
                        ? `${writableDateLabel} 까지 받을 수 있어요`
                        : '작성 기간까지 받을 수 있어요'}
                    </strong>
                  </>
                ) : (
                  <>
                    롤링페이퍼는{' '}
                    <strong className="font-semibold text-white">
                      {openDateLabel ? `${openDateLabel} 밤 10시` : '생성일 밤 10시'}
                    </strong>
                    에 공개돼요
                  </>
                )}
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
          onToppingClick={onToppingClick ?? (() => undefined)}
          hasBottomAction={showShareControls}
          isInteractive={Boolean(onToppingClick)}
        />
      )}

      {showShareControls && (
        <div data-capture-hidden>
          <RollingPaperShareNotice />
        </div>
      )}

      {showShareControls && (
        <RollingPaperShareActionArea
          writableUntil={writableUntil}
          isActivatingInvite={isActivatingInvite}
          onShareClick={openShareSheet}
          onWritingExpired={() => setHasWritableTime(false)}
          variant="solid"
          showTooltip={false}
          layout="compact"
          leadingAction={
            hasMessages ? (
              <ImageDownloadButton targetRef={captureTargetRef} />
            ) : (
              // 받은 편지가 없으면 화면 대신 저장용 레이아웃(360x640)을 1080x1920으로
              <ImageDownloadButton targetRef={emptyCaptureTargetRef} pixelRatio={3} />
            )
          }
        />
      )}

      {showShareControls && !hasMessages && (
        <RollingPaperEmptyCaptureView captureRef={emptyCaptureTargetRef} hostName={hostName} />
      )}

      {showShareControls && (
        <LinkShareSheet
          isOpen={isShareSheetOpen}
          link={inviteShareLink ?? ''}
          title="롤링페이퍼 링크 공유하기"
          shareText="롤링페이퍼 작성 초대장이 왔어요"
          onClose={closeShareSheet}
        />
      )}
    </div>
  );
}
