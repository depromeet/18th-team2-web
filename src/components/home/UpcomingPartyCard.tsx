import { B1, H2 } from '@/components/ui/Typography';
import type { PartyRole } from '@/constants/party';
import type { PartyOption, UpcomingParty } from '@/types/home';
import { canShareParty } from '@/utils/party';

interface UpcomingPartyCardProps {
  party: UpcomingParty;
  onAction?: () => void;
  /** 링크 복사 버튼 노출 시 — 초대 링크 공유 시트 열기 */
  onShare?: () => void;
}

type ActionVariant = 'primary' | 'disabled';

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

const ACTION_VARIANT_CLASS: Record<ActionVariant, string> = {
  primary: 'bg-blue-500 text-white',
  disabled: 'bg-grey-50 text-grey-300',
};

export function UpcomingPartyCard({ party, onAction, onShare }: UpcomingPartyCardProps) {
  const { partyName, date, time, endDate, role, partyOption, isOpen, isEnded, inviteToken } = party;
  const view = isEnded
    ? ENDED_VIEW[role]
    : UPCOMING_PARTY_CARD_VIEW[role][partyOption][isOpen ? 'open' : 'closed'];
  const isRollingPaper = partyOption === 'PAPER_ONLY';
  const isActionEnabled = view.actionVariant === 'primary';
  // 링크 복사 노출 규칙은 canShareParty 단일 소스 사용 (HomePage 공유 핸들러와 동일 기준)
  const showShareButton = canShareParty(party);
  const canShare = Boolean(inviteToken);

  return (
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
          <button
            type="button"
            className="rounded-btn-sm text-label-1 disabled:bg-grey-50 disabled:text-grey-300 flex-1 border border-blue-200 bg-white py-2 font-semibold text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            onClick={canShare ? onShare : undefined}
            disabled={!canShare}
          >
            링크 복사
          </button>
          <button
            type="button"
            className={`rounded-btn-sm text-label-1 flex-1 py-2 font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${ACTION_VARIANT_CLASS[view.actionVariant]}`}
            onClick={isActionEnabled ? onAction : undefined}
            disabled={!isActionEnabled}
          >
            {view.actionText}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={`rounded-btn-sm text-label-1 w-full py-2 font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${ACTION_VARIANT_CLASS[view.actionVariant]}`}
          onClick={isActionEnabled ? onAction : undefined}
          disabled={!isActionEnabled}
        >
          {view.actionText}
        </button>
      )}
    </div>
  );
}
