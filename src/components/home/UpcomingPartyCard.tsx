import { B1 } from '@/components/ui/Typography';

type PartyRole = 'host' | 'participant';

type PartyStatus = 'default' | 'soon' | 'rollingPaper' | 'rollingPaperOpen';

export interface UpcomingParty {
  partyId?: string;
  partyName: string;
  date: string;
  time?: string;
  endDate?: string;
  role: PartyRole;
  status: PartyStatus;
}

interface UpcomingPartyCardProps {
  party: UpcomingParty;
  onAction?: () => void;
}

function getLabel(status: PartyStatus): { text: string; color: string } {
  if (status === 'rollingPaper' || status === 'rollingPaperOpen') {
    return { text: '롤링페이퍼', color: 'bg-yellow-100 text-yellow-900' };
  }
  return { text: '라이브 파티', color: 'bg-blue-200 text-blue-900' };
}

function getActionButton(
  role: PartyRole,
  status: PartyStatus,
): { text: string; style: string } | null {
  if (role === 'participant') {
    if (status === 'default') return { text: '초대장 확인하기', style: 'bg-blue-500 text-white' };
    if (status === 'soon') return { text: '파티 입장하기', style: 'bg-blue-500 text-white' };
    if (status === 'rollingPaper')
      return { text: '롤링페이퍼 작성하기', style: 'bg-blue-500 text-white' };
  }
  if (role === 'host') {
    if (status === 'default')
      return {
        text: '파티 시작 5분 전에 입장할 수 있어요',
        style: 'bg-grey-50 text-grey-300',
      };
    if (status === 'soon') return { text: '파티 시작하기', style: 'bg-blue-500 text-white' };
    if (status === 'rollingPaper')
      return { text: '파티 당일 밤 10시에 공개되어요', style: 'bg-grey-50 text-grey-300' };
    if (status === 'rollingPaperOpen')
      return { text: '롤링페이퍼 확인하기', style: 'bg-blue-500 text-white' };
  }
  return null;
}

function isRollingPaperStatus(status: PartyStatus): boolean {
  return status === 'rollingPaper' || status === 'rollingPaperOpen';
}

export function UpcomingPartyCard({ party, onAction }: UpcomingPartyCardProps) {
  const { partyName, date, time, endDate, role, status } = party;
  const label = getLabel(status);
  const action = getActionButton(role, status);
  const isRollingPaper = isRollingPaperStatus(status);

  return (
    <div className="rounded-btn-lg flex h-32.5 flex-col justify-between bg-blue-50 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-grey-500 text-label-1 font-medium">예정된 파티</span>
          <span className={`text-label-2 rounded-md px-2 py-1 font-semibold ${label.color}`}>
            {label.text}
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
      {action && (
        <button
          type="button"
          className={`rounded-btn-sm text-label-1 w-full py-2 font-semibold ${action.style}`}
          onClick={onAction}
        >
          {action.text}
        </button>
      )}
    </div>
  );
}
