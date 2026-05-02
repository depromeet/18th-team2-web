import { L2, B1, Caption } from '@/components/ui/Typography';

type PartyRole = 'host' | 'participant';

type PartyStatus = 'default' | 'soon' | 'rollingPaper' | 'rollingPaperOpen';

export interface UpcomingParty {
  partyName: string;
  date: string;
  role: PartyRole;
  status: PartyStatus;
}

interface UpcomingPartyCardProps {
  party: UpcomingParty;
  onAction?: () => void;
}

function getLabel(status: PartyStatus): { text: string; color: string } {
  if (status === 'rollingPaper' || status === 'rollingPaperOpen') {
    return { text: '롤링페이퍼', color: 'bg-blue-100 text-blue-700' };
  }
  return { text: '라이브 파티', color: 'bg-blue-100 text-blue-700' };
}

function getActionButton(
  role: PartyRole,
  status: PartyStatus,
): { text: string; style: string } | null {
  if (role === 'participant') {
    if (status === 'default') return { text: '초대장 확인하기', style: 'bg-blue-50 text-blue-700' };
    if (status === 'soon') return { text: '파티 입장하기', style: 'bg-yellow-400 text-grey-900' };
    if (status === 'rollingPaper')
      return { text: '롤링페이퍼 작성하기', style: 'bg-blue-50 text-blue-700' };
  }
  if (role === 'host') {
    if (status === 'soon') return { text: '파티 시작하기', style: 'bg-yellow-400 text-grey-900' };
    if (status === 'rollingPaperOpen')
      return { text: '롤링페이퍼 확인하기', style: 'bg-blue-50 text-blue-700' };
  }
  return null;
}

function getSubText(role: PartyRole, status: PartyStatus): string | null {
  if (role === 'host' && status === 'default') {
    return '파티 시작 5분 전에 입장할 수 있어요';
  }
  if (role === 'host' && status === 'rollingPaper') {
    return '파티 당일 밤 10시에 공개되어요';
  }
  return null;
}

export function UpcomingPartyCard({ party, onAction }: UpcomingPartyCardProps) {
  const { partyName, date, role, status } = party;
  const label = getLabel(status);
  const action = getActionButton(role, status);
  const subText = getSubText(role, status);

  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Caption className="text-grey-400">예정된 파티</Caption>
        <span className={`text-caption-1 rounded-full px-2 py-0.5 font-medium ${label.color}`}>
          {label.text}
        </span>
      </div>
      <div className="mt-2">
        <B1 className="font-semibold">{partyName}</B1>
        <L2 className="text-grey-400 mt-0.5">{date}</L2>
      </div>
      {subText && <Caption className="text-grey-400 mt-3">{subText}</Caption>}
      {action && (
        <button
          type="button"
          className={`text-body-2 mt-3 w-full rounded-xl py-3 font-semibold ${action.style}`}
          onClick={onAction}
        >
          {action.text}
        </button>
      )}
    </div>
  );
}
