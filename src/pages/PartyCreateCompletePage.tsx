import { useLocation, useNavigate } from 'react-router-dom';

import homeIcon from '@/assets/icons/icon-home.svg';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/Button';
import { B1, H1, H2 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import { formatDotDate, getTodayMidnight } from '@/utils/date';

const PARTY_DURATION_MINUTES = 10;
// TODO: 새로고침/직접 진입 대비 — 파티 ID 기반 조회로 교체
const DEFAULT_HOST_NAME = '김이라';
const DEFAULT_PARTY_TIME = '오후 4:00';

interface PartyCompleteState {
  hostName?: string;
  partyDate?: string;
  partyTime?: string | null;
  characterId?: string;
}

function getPartyCompleteState(state: unknown): PartyCompleteState {
  if (!state || typeof state !== 'object') return {};
  return state as PartyCompleteState;
}

function formatInvitationDate(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function PartyCreateCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const partyState = getPartyCompleteState(location.state);

  const hostName = partyState.hostName ?? DEFAULT_HOST_NAME;
  const partyDate = partyState.partyDate ? new Date(partyState.partyDate) : getTodayMidnight();
  const partyTime = partyState.partyTime ?? DEFAULT_PARTY_TIME;
  const footerText = `${formatDotDate(partyDate)}  |  ${partyTime}`;

  const handleShareLink = () => {
    // TODO: 공유 링크 생성/복사 API 연결
  };

  return (
    <MobileLayout>
      <div className="party-complete-page relative flex min-h-screen flex-col overflow-hidden px-5">
        <header className="flex justify-end pt-16">
          <button
            type="button"
            onClick={() => navigate(ROUTES.home)}
            aria-label="홈으로 이동"
            className="flex h-10 w-10 items-center justify-center"
          >
            <img src={homeIcon} alt="" className="h-6 w-6 opacity-20" />
          </button>
        </header>

        <H1 className="party-complete-title mt-10 text-center">파티 초대장이 완성되었어요</H1>

        <div className="mx-auto mt-16 flex w-full max-w-[343px] flex-1 flex-col">
          <div className="party-complete-card rounded-[8px] bg-white px-9 pt-10 pb-9">
            <H2 className="text-center">파티 초대장</H2>
            <div className="mt-7 border-t border-grey-50" />

            <div className="mt-8 flex flex-col gap-3 text-head-1 font-normal text-grey-600 tracking-[-0.0002em]">
              <div>
                <strong className="text-blue-500">{hostName}</strong>
                <span>를 위해</span>
              </div>
              <div>
                <strong className="text-blue-500">{formatInvitationDate(partyDate)}</strong>
                <span>에</span>
              </div>
              <div>
                <strong className="text-blue-500">{partyTime}</strong>
                <span>부터 {PARTY_DURATION_MINUTES}분 동안</span>
              </div>
              <span>온라인 생일 파티가 열려요</span>
            </div>

            <div className="mt-12 border-t border-grey-50" />
            <B1 className="mt-7 font-medium text-grey-200">{footerText}</B1>
          </div>

          <B1 className="party-complete-notice mt-3 font-medium text-white">
            * 파티 시작 24시간 전까지 수정할 수 있어요
          </B1>

          <div className="party-complete-button mt-auto pb-6">
            <Button variant="white" size="full" onClick={handleShareLink}>
              링크 공유하기
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
