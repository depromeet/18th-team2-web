import { useMemo, useState } from 'react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';

import homeIcon from '@/assets/icons/icon-home.svg';
import { CompletedInvitationCard } from '@/components/party-create/CompletedInvitationCard';
import { Button } from '@/components/ui/Button';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { B1, H1 } from '@/components/ui/Typography';
import { DUMMY_HOST_NAME, PARTY_DURATION_MINUTES } from '@/constants/partyCreate';
import { ROUTES } from '@/constants/routes';
import { getTodayMidnight } from '@/utils/date';
// TODO: 새로고침/직접 진입 대비 — 파티 ID 기반 조회로 교체
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

export default function PartyCreateCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const partyState = getPartyCompleteState(location.state);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  const hostName = partyState.hostName ?? DUMMY_HOST_NAME;
  const partyDate = partyState.partyDate ? new Date(partyState.partyDate) : getTodayMidnight();
  const partyTime = partyState.partyTime ?? DEFAULT_PARTY_TIME;
  // TODO: 생성 API 응답의 partyId로 activateInviteLink mutation을 호출하고 실제 inviteToken으로 교체
  const shareLink = useMemo(
    () =>
      `${window.location.origin}${generatePath(ROUTES.partyInvite, { inviteToken: 'mock-invite-token' })}`,
    [],
  );

  const handleShareLink = () => {
    setIsShareSheetOpen(true);
  };

  return (
    <div className="party-complete-page relative flex min-h-screen flex-col overflow-hidden px-5">
      <header className="relative h-[42px]">
        <button
          type="button"
          onClick={() => navigate(ROUTES.home)}
          aria-label="홈으로 이동"
          className="absolute top-[9px] right-0 flex h-6 w-6 items-center justify-center"
        >
          <img src={homeIcon} alt="" className="h-6 w-6 opacity-20" />
        </button>
      </header>

      <H1 className="party-complete-title mt-10 text-center">파티 초대장이 완성되었어요</H1>

      <div className="mx-auto mt-16 flex w-full max-w-[343px] flex-1 flex-col">
        <CompletedInvitationCard
          className="party-complete-card"
          title="파티 초대장"
          hostName={hostName}
          partyDate={partyDate}
          partyTime={partyTime}
          durationMinutes={PARTY_DURATION_MINUTES}
        />

        <B1 className="party-complete-notice mt-3 font-medium text-white">
          * 파티 시작 24시간 전까지 수정할 수 있어요
        </B1>

        <div className="party-complete-button mt-auto pb-6">
          <Button variant="white" size="full" onClick={handleShareLink}>
            링크 공유하기
          </Button>
        </div>
      </div>

      <LinkShareSheet
        isOpen={isShareSheetOpen}
        link={shareLink}
        title="초대장 링크 공유하기"
        shareText="파티 초대장이 도착했어요"
        onClose={() => setIsShareSheetOpen(false)}
      />
    </div>
  );
}
