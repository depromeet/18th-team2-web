import { useEffect, useMemo, useState } from 'react';

import { B1, H2 } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ErrorCircleFilledIcon } from '@/components/ui/icons/ErrorCircleFilledIcon';
import { PARTY_ROLE, type PartyRole } from '@/constants/party';
import type { PartyOption, UpcomingParty } from '@/types/home';
import { canShareParty } from '@/utils/party';
import InfoIcon from '@/assets/icons/icon-info.svg?react';
import { parseKstDateTime } from '@/utils/date';

interface UpcomingPartyCardProps {
  party: UpcomingParty;
  onAction?: () => void;
  /** 링크 복사 버튼 노출 시 — 초대 링크 공유 시트 열기 */
  onShare?: () => void;
}

type ActionVariant = 'primary' | 'disabled';
type CardButtonVariant = 'primary' | 'secondary';

interface UpcomingPartyCardView {
  badgeText: string;
  badgeClassName: string;
  actionText: string;
  actionVariant: ActionVariant;
}

const LIVE_BADGE = { badgeText: '라이브 파티', badgeClassName: 'bg-blue-50 text-blue-700' };
const PAPER_BADGE = { badgeText: '롤링페이퍼', badgeClassName: 'bg-yellow-100 text-yellow-900' };

// 카드 분기 매핑 단일 소스 — 디자인(메인 UI) 7개 상태.
// [role][partyOption][열림 여부] → 뱃지 + 액션. 참가자 PAPER_ONLY는 isOpen과 무관해 동일.
const UPCOMING_PARTY_CARD_VIEW: Record<
  PartyRole,
  Record<PartyOption, Record<'open' | 'closed', UpcomingPartyCardView>>
> = {
  PARTICIPANT: {
    REALTIME: {
      closed: { ...LIVE_BADGE, actionText: '초대장 확인하기', actionVariant: 'primary' },
      open: { ...LIVE_BADGE, actionText: '초대장 확인하기', actionVariant: 'primary' },
    },
    PAPER_ONLY: {
      closed: { ...PAPER_BADGE, actionText: '롤링페이퍼 작성하기', actionVariant: 'primary' },
      open: { ...PAPER_BADGE, actionText: '롤링페이퍼 작성하기', actionVariant: 'primary' },
    },
  },
  HOST: {
    // REALTIME은 참가자·주최자 모두 바로 입장이 아닌 초대장 확인 화면으로 이동 (입장·공유 허브)
    REALTIME: {
      closed: { ...LIVE_BADGE, actionText: '초대장 확인하기', actionVariant: 'primary' },
      open: { ...LIVE_BADGE, actionText: '초대장 확인하기', actionVariant: 'primary' },
    },
    PAPER_ONLY: {
      closed: {
        ...PAPER_BADGE,
        actionText: '밤 10시 공개 예정',
        actionVariant: 'disabled',
      },
      open: { ...PAPER_BADGE, actionText: '롤링페이퍼 확인하기', actionVariant: 'primary' },
    },
  },
};

// 라이브 종료(롤링페이퍼 단계) — 라이브/롤페 구분(뱃지·제목)은 그대로, 액션만 롤페로.
// 종료된 파티는 초대 링크가 불필요하므로 '링크 복사' 없이 단일 버튼.
const ENDED_VIEW: Record<PartyRole, UpcomingPartyCardView> = {
  HOST: { ...LIVE_BADGE, actionText: '롤링페이퍼 확인하기', actionVariant: 'primary' },
  PARTICIPANT: { ...LIVE_BADGE, actionText: '롤링페이퍼 작성하기', actionVariant: 'primary' },
};

const ACTION_BUTTON_VARIANT: Record<ActionVariant, CardButtonVariant> = {
  primary: 'primary',
  disabled: 'secondary',
};

const ROLLING_PAPER_COUNTDOWN_THRESHOLD_MS = 24 * 60 * 60 * 1000;
const COUNTDOWN_TICK_MS = 1000;
const ROLLING_PAPER_OPEN_FALLBACK_TEXT = '당일 밤 10시 공개 예정';

function parseValidRollingPaperOpenTime(openAt: string | undefined) {
  if (!openAt) return null;
  const openTime = parseKstDateTime(openAt);
  return openTime.isValid() ? openTime : null;
}

function getRollingPaperOpenText(openAt: string | undefined, nowMs: number) {
  const openTime = parseValidRollingPaperOpenTime(openAt);
  if (!openTime) return ROLLING_PAPER_OPEN_FALLBACK_TEXT;

  const remainingMs = openTime.valueOf() - nowMs;
  if (remainingMs <= 0) return '롤링페이퍼 확인하기';
  if (remainingMs > ROLLING_PAPER_COUNTDOWN_THRESHOLD_MS) {
    return ROLLING_PAPER_OPEN_FALLBACK_TEXT;
  }

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}시간 ${minutes}분 후 공개`;
  if (minutes > 0) return `${minutes}분 ${seconds}초 후 공개`;
  return `${seconds}초 후 공개`;
}

function hasRollingPaperOpened(openAt: string | undefined, nowMs: number) {
  const openTime = parseValidRollingPaperOpenTime(openAt);
  return Boolean(openTime && openTime.valueOf() <= nowMs);
}

export function UpcomingPartyCard({ party, onAction, onShare }: UpcomingPartyCardProps) {
  const { partyName, date, time, endDate, role, partyOption, isOpen, isEnded, inviteToken } = party;
  const [nowMs, setNowMs] = useState(() => Date.now());
  const isRollingPaper = partyOption === 'PAPER_ONLY';
  const isHost = role === PARTY_ROLE.HOST;
  const isHostPaperOnly = isHost && isRollingPaper && !isEnded;
  const effectiveIsOpen =
    isOpen || (isHostPaperOnly && hasRollingPaperOpened(party.rollingPaperOpenAt, nowMs));
  const view = isEnded
    ? ENDED_VIEW[role]
    : UPCOMING_PARTY_CARD_VIEW[role][partyOption][effectiveIsOpen ? 'open' : 'closed'];
  const isHostPaperOnlyClosed = isHostPaperOnly && !effectiveIsOpen;
  const isActionEnabled = view.actionVariant === 'primary';
  // 링크 복사 노출 규칙은 canShareParty 단일 소스 사용 (HomePage 공유 핸들러와 동일 기준)
  const showShareButton = canShareParty(party);
  const canShare = Boolean(inviteToken);
  const showEnterNotice = partyOption === 'REALTIME' && isOpen && !isEnded;
  const showEndedNotice = partyOption === 'REALTIME' && isEnded && isHost;
  const noticeTone = showEnterNotice ? 'enter' : showEndedNotice ? 'ended' : null;
  const shareButtonText = showEnterNotice
    ? '초대링크 복사하기'
    : showEndedNotice
      ? '공유하기'
      : isHost && isRollingPaper
        ? '공유하기'
        : '초대장 공유하기';
  const rollingPaperOpenText = useMemo(
    () => getRollingPaperOpenText(party.rollingPaperOpenAt, nowMs),
    [party.rollingPaperOpenAt, nowMs],
  );
  const actionButtonText = showEnterNotice
    ? '파티 입장하기'
    : isHostPaperOnlyClosed
      ? rollingPaperOpenText
      : view.actionText;

  useEffect(() => {
    if (!isHostPaperOnlyClosed || !party.rollingPaperOpenAt) return;

    const openTime = parseValidRollingPaperOpenTime(party.rollingPaperOpenAt);
    if (!openTime) return;

    const remainingMs = openTime.valueOf() - Date.now();
    if (remainingMs <= 0 || remainingMs > ROLLING_PAPER_COUNTDOWN_THRESHOLD_MS) return;

    const timerId = window.setInterval(() => setNowMs(Date.now()), COUNTDOWN_TICK_MS);
    return () => window.clearInterval(timerId);
  }, [isHostPaperOnlyClosed, party.rollingPaperOpenAt]);

  return (
    <div
      className={`rounded-btn-lg flex flex-col overflow-hidden ${
        noticeTone === 'enter' ? 'bg-red-30' : noticeTone === 'ended' ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="rounded-btn-lg flex flex-col gap-3 bg-white p-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <H2>{partyName}</H2>
            <span
              className={`text-label-2 shrink-0 rounded-md px-2 py-1 font-semibold ${view.badgeClassName}`}
            >
              {view.badgeText}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <B1 className="font-medium">{date}</B1>
            {isRollingPaper && endDate ? (
              <>
                <span className="text-grey-200 text-body-1 font-medium">~</span>
                <B1 className="font-medium">{endDate}</B1>
              </>
            ) : (
              time && (
                <>
                  <span className="border-grey-200 h-3 border-l" />
                  <B1 className="font-medium">{time}</B1>
                </>
              )
            )}
          </div>
        </div>

        {showShareButton ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="white-blue"
              size="sm"
              className="text-label-1 flex-1"
              onClick={onShare}
              disabled={!canShare}
            >
              {shareButtonText}
            </Button>
            <Button
              type="button"
              variant={ACTION_BUTTON_VARIANT[view.actionVariant]}
              size="sm"
              className="text-label-1 flex-1"
              onClick={onAction}
              disabled={!isActionEnabled}
            >
              {actionButtonText}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant={ACTION_BUTTON_VARIANT[view.actionVariant]}
            size="sm"
            className="text-label-1 w-full"
            onClick={onAction}
            disabled={!isActionEnabled}
          >
            {actionButtonText}
          </Button>
        )}
      </div>

      {noticeTone && (
        <div className="flex min-h-9 items-center justify-center gap-1 px-3 py-2">
          {noticeTone === 'enter' ? (
            <ErrorCircleFilledIcon className="h-5 w-5 shrink-0" aria-hidden />
          ) : (
            <InfoIcon className="h-5 w-5 shrink-0" aria-hidden />
          )}
          <p
            className={`text-label-1 min-w-0 truncate font-semibold ${
              noticeTone === 'enter' ? 'text-red-600' : 'text-blue-600'
            }`}
          >
            {noticeTone === 'enter'
              ? '파티 시작이 5분 남았어요! 지금 바로 입장해주세요!'
              : '라이브 파티가 종료됐어요'}
          </p>
        </div>
      )}
    </div>
  );
}
