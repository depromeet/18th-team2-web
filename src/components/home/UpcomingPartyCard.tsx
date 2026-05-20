import { B1 } from '@/components/ui/Typography';
import type { PartyOption, PartyRole, UpcomingParty } from '@/types/home';

interface UpcomingPartyCardProps {
  party: UpcomingParty;
  onAction?: () => void;
}

type ActionVariant = 'primary' | 'disabled';

interface UpcomingPartyCardView {
  badgeText: string;
  badgeClassName: string;
  actionText: string;
  actionVariant: ActionVariant;
}

const LIVE_BADGE = { badgeText: '라이브 파티', badgeClassName: 'bg-blue-200 text-blue-900' };
const PAPER_BADGE = { badgeText: '롤링페이퍼', badgeClassName: 'bg-yellow-100 text-yellow-900' };

// 카드 분기 매핑 단일 소스 — 디자인(메인 UI) 7개 상태.
// [role][partyOption][열림 여부] → 뱃지 + 액션. 참가자 PAPER_ONLY는 isOpen과 무관해 동일.
const UPCOMING_PARTY_CARD_VIEW: Record<
  PartyRole,
  Record<PartyOption, Record<'open' | 'closed', UpcomingPartyCardView>>
> = {
  participant: {
    REALTIME: {
      closed: { ...LIVE_BADGE, actionText: '초대장 확인하기', actionVariant: 'primary' },
      open: { ...LIVE_BADGE, actionText: '파티 입장하기', actionVariant: 'primary' },
    },
    PAPER_ONLY: {
      closed: { ...PAPER_BADGE, actionText: '롤링페이퍼 작성하기', actionVariant: 'primary' },
      open: { ...PAPER_BADGE, actionText: '롤링페이퍼 작성하기', actionVariant: 'primary' },
    },
  },
  host: {
    REALTIME: {
      closed: {
        ...LIVE_BADGE,
        actionText: '파티 시작 5분 전에 입장할 수 있어요',
        actionVariant: 'disabled',
      },
      open: { ...LIVE_BADGE, actionText: '파티 시작하기', actionVariant: 'primary' },
    },
    PAPER_ONLY: {
      closed: {
        ...PAPER_BADGE,
        actionText: '파티 당일 밤 10시에 공개되어요',
        actionVariant: 'disabled',
      },
      open: { ...PAPER_BADGE, actionText: '롤링페이퍼 확인하기', actionVariant: 'primary' },
    },
  },
};

const ACTION_VARIANT_CLASS: Record<ActionVariant, string> = {
  primary: 'bg-blue-500 text-white',
  disabled: 'bg-grey-50 text-grey-300',
};

export function UpcomingPartyCard({ party, onAction }: UpcomingPartyCardProps) {
  const { partyName, date, time, endDate, role, partyOption, isOpen } = party;
  const view = UPCOMING_PARTY_CARD_VIEW[role][partyOption][isOpen ? 'open' : 'closed'];
  const isRollingPaper = partyOption === 'PAPER_ONLY';
  const isActionEnabled = view.actionVariant === 'primary';

  return (
    <div className="rounded-btn-lg flex h-32.5 flex-col justify-between bg-blue-50 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-grey-500 text-label-1 font-medium">예정된 파티</span>
          <span
            className={`text-label-2 rounded-md px-2 py-1 font-semibold ${view.badgeClassName}`}
          >
            {view.badgeText}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <B1 className="font-semibold">{partyName}</B1>
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
      </div>
      <button
        type="button"
        className={`rounded-btn-sm text-label-1 w-full py-2 font-semibold ${ACTION_VARIANT_CLASS[view.actionVariant]}`}
        onClick={isActionEnabled ? onAction : undefined}
        disabled={!isActionEnabled}
      >
        {view.actionText}
      </button>
    </div>
  );
}
