import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import shareIcon from '@/assets/icons/icon-share.svg';
import defaultInvitationCharacter from '@/assets/images/character/character-blue-full.png';
import letterImage from '@/assets/images/live-party/letter.png';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { ROUTES } from '@/constants/routes';
import { formatDateParts, isFuture } from '@/utils/date';
import { buildRollingPaperWritePath } from '@/utils/rollingPaperWrite';

const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'] as const;

interface PartyEndedViewProps {
  partyId: string;
  inviteToken: string;
  hostName: string;
  writableFrom: Date;
  writableUntil: Date;
}

function formatInvitationDate(date: Date) {
  const { year, month, day } = formatDateParts(date);
  return `${year} · ${month} · ${day}`;
}

function formatDday(date: Date) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diff = Math.ceil((targetStart - todayStart) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'D-Day';
  return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
}

function formatRemainingTime(targetDate: Date, now: number) {
  const remainingMs = Math.max(0, targetDate.getTime() - now);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}일 ${hours}시간 ${String(minutes).padStart(2, '0')}분 ${String(seconds).padStart(2, '0')}초`;
}

export function PartyEndedView({
  partyId,
  inviteToken,
  hostName,
  writableFrom,
  writableUntil,
}: PartyEndedViewProps) {
  const navigate = useNavigate();
  const [now, setNow] = useState(() => Date.now());
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const isExpired = !isFuture(writableUntil);
  const inviteLink = `${window.location.origin}${window.location.pathname}`;

  function handlePrimaryClick() {
    if (isExpired) {
      navigate(ROUTES.home);
    } else {
      navigate(buildRollingPaperWritePath(partyId, inviteToken), {
        state: {
          completeCta: 'home',
          invitePath: window.location.pathname,
          inviteToken,
          hostName,
        },
      });
    }
  }

  useEffect(() => {
    if (isExpired) return;

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [isExpired]);

  return (
    <>
      <main className="bg-gradient-bg flex min-h-dvh flex-col overflow-x-hidden">
        <header className="mx-auto flex h-18 w-full max-w-150 items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            aria-label="뒤로가기"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            onClick={() => navigate(-1)}
          >
            <ChevronLeftIcon className="text-grey-900 h-6 w-6" />
          </button>

          {!isExpired && (
            <button
              type="button"
              className="text-label-1 flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(0,0,0,0.7)] py-2 pr-3 pl-2.5 font-medium text-white backdrop-blur-[2px] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              onClick={() => setIsShareSheetOpen(true)}
            >
              <img src={shareIcon} alt="" aria-hidden="true" className="h-5 w-5" />
              공유하기
            </button>
          )}
        </header>

        <section
          className={`mx-auto flex w-full max-w-150 flex-1 flex-col items-center px-4 pb-[calc(24px+env(safe-area-inset-bottom))] ${
            isExpired
              ? 'pt-[clamp(16px,4svh,32px)]'
              : 'pt-[clamp(18px,4svh,42px)] [@media_(max-height:740px)]:pt-2'
          }`}
        >
          <div
            className={`flex w-full flex-col items-center ${
              isExpired ? 'gap-0' : 'gap-5 [@media_(max-height:740px)]:gap-3'
            }`}
          >
            {!isExpired && (
              <span className="text-caption-1 rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-600">
                온라인 생일파티 종료
              </span>
            )}

            {isExpired ? (
              <h1 className="text-head-1 text-grey-900 max-w-full px-4 text-center font-semibold break-words">
                아쉽지만 작성이 <span className="text-red-500">마감</span>되었어요
                <br />
                다음에는 꼭 함께 마음을 남겨보세요!
              </h1>
            ) : (
              <h1 className="text-head-1 text-grey-900 max-w-full px-4 text-center font-semibold break-words">
                축하는 아직 늦지 않았어요
                <br />
                롤링페이퍼를 남겨보세요!
              </h1>
            )}

            {!isExpired && (
              <img
                src={defaultInvitationCharacter}
                alt=""
                aria-hidden="true"
                className="h-[120px] w-[120px] object-contain [@media_(max-height:740px)]:h-[96px] [@media_(max-height:740px)]:w-[96px]"
              />
            )}
          </div>

          <article
            className={`flex w-full max-w-[343px] flex-col items-center rounded-[12px] bg-white px-5 ${
              isExpired
                ? 'mt-[clamp(28px,6svh,44px)] justify-center pt-5 pb-6'
                : 'mt-8 pt-5 pb-5 [@media_(max-height:740px)]:mt-5 [@media_(max-height:740px)]:pt-4 [@media_(max-height:740px)]:pb-4'
            }`}
            style={{ boxShadow: '0px 0px 4px rgba(88, 146, 255, 0.3)' }}
          >
            <span
              className={`text-caption-1 rounded-full px-2.5 py-1 font-bold ${
                isExpired ? 'bg-red-30 text-red-500' : 'bg-blue-50 text-blue-600'
              }`}
            >
              {isExpired ? '마감' : formatDday(writableUntil)}
            </span>

            <div className="mt-5 text-center">
              {isExpired ? (
                <div className="flex flex-col gap-1 opacity-50">
                  <p className="text-body-1 text-grey-700 font-medium whitespace-nowrap">
                    {formatInvitationDate(writableFrom)}{' '}
                    <span className="text-head-3 font-bold text-blue-500">
                      {WEEKDAYS[writableFrom.getDay()]}
                    </span>{' '}
                    <span className="text-label-1 text-grey-500">부터</span>
                  </p>
                  <p className="text-body-1 text-grey-700 font-medium whitespace-nowrap">
                    {formatInvitationDate(writableUntil)}{' '}
                    <span className="text-head-3 font-bold text-blue-500">
                      {WEEKDAYS[writableUntil.getDay()]}
                    </span>{' '}
                    <span className="text-label-1 text-grey-500">까지</span>
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-head-3 text-grey-700 font-medium whitespace-nowrap">
                    {formatInvitationDate(writableUntil)}{' '}
                    <span className="font-bold text-blue-500">
                      {WEEKDAYS[writableUntil.getDay()]}까지
                    </span>
                  </p>
                  <p className="text-body-1 text-grey-500 mt-2 font-medium">
                    <span className="font-semibold text-red-500">
                      {formatRemainingTime(writableUntil, now)}
                    </span>{' '}
                    남았어요
                  </p>
                </>
              )}
            </div>

            <img
              src={letterImage}
              alt=""
              aria-hidden="true"
              className={`w-full max-w-[240px] object-contain ${
                isExpired
                  ? 'mt-6 h-[220px] opacity-50'
                  : 'mt-7 h-[220px] [@media_(max-height:740px)]:mt-5 [@media_(max-height:740px)]:h-[170px]'
              }`}
            />
          </article>

          <div
            className={`flex w-full max-w-[343px] flex-col items-center gap-4 ${
              isExpired ? 'mt-auto pt-8' : 'mt-8 [@media_(max-height:740px)]:mt-5'
            }`}
          >
            {!isExpired && (
              <p className="text-label-1 text-grey-500 text-center font-medium">
                작성한 내용은 <span className="font-semibold text-blue-600">생일 주인공</span>만 볼
                수 있어요
              </p>
            )}

            <Button
              className={
                isExpired
                  ? ''
                  : 'bg-[linear-gradient(111deg,#5892FC_20.81%,#3444F3_70.81%)] shadow-[5px_5px_14px_#8FB6FF]'
              }
              variant={isExpired ? 'white-blue' : 'primary'}
              size="full"
              onClick={handlePrimaryClick}
            >
              {isExpired ? '홈으로' : '롤링페이퍼 남기기'}
            </Button>
          </div>
        </section>
      </main>

      <LinkShareSheet
        isOpen={isShareSheetOpen}
        link={inviteLink}
        title="초대장 링크 공유하기"
        shareText="초대장이 도착했어요"
        onClose={() => setIsShareSheetOpen(false)}
      />
    </>
  );
}
