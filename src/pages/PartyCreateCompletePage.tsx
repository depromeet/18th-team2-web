import { useCallback, useMemo, useState } from 'react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';

import iconChat from '@/assets/icons/icon-chat.svg';
import homeIcon from '@/assets/icons/icon-home.svg';
import { CompletedInvitationCard } from '@/components/party-create/CompletedInvitationCard';
import { Button } from '@/components/ui/Button';
import { Toast, type ToastState } from '@/components/ui/Toast';
import { B1, H1 } from '@/components/ui/Typography';
import { DUMMY_HOST_NAME, PARTY_DURATION_MINUTES } from '@/constants/partyCreate';
import { ROUTES } from '@/constants/routes';
import { useTalkCalendarReminder } from '@/hooks/party-invitation/useTalkCalendarReminder';
import { usePartyCountdown } from '@/hooks/usePartyCountdown';
import { getTodayMidnight, parseKstDateTime } from '@/utils/date';
// TODO: 새로고침/직접 진입 대비 — 파티 ID 기반 조회로 교체
const DEFAULT_PARTY_TIME = '오후 4:00';

interface PartyCompleteState {
  hostName?: string;
  partyDate?: string;
  partyTime?: string | null;
  characterId?: string;
  partyId?: number;
  inviteToken?: string;
  startedDate?: string;
  startTime?: string;
}

function getPartyCompleteState(state: unknown): PartyCompleteState {
  if (!state || typeof state !== 'object') return {};
  return state as PartyCompleteState;
}

export default function PartyCreateCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const partyState = getPartyCompleteState(location.state);
  const [toast, setToast] = useState<ToastState | null>(null);

  const hostName = partyState.hostName || DUMMY_HOST_NAME;
  const partyDate = partyState.partyDate ? new Date(partyState.partyDate) : getTodayMidnight();
  const partyTime = partyState.partyTime ?? DEFAULT_PARTY_TIME;
  const inviteToken = partyState.inviteToken;
  const invitePath = useMemo(
    () => (inviteToken ? generatePath(ROUTES.partyInvite, { inviteToken }) : ''),
    [inviteToken],
  );
  // 톡캘린더 동의 후에는 state가 사라지므로 초대장 페이지로 돌아가 등록을 이어간다
  const reminderReturnLocation = useMemo(
    () => ({ pathname: invitePath, search: '' }),
    [invitePath],
  );
  // 초대장과 동일하게 파티 시작 5분 전부터 톡캘린더 알림 버튼을 숨긴다
  const startsAt = useMemo(
    () =>
      partyState.startedDate && partyState.startTime
        ? parseKstDateTime(`${partyState.startedDate}T${partyState.startTime}:00`).toDate()
        : new Date(NaN),
    [partyState.startedDate, partyState.startTime],
  );
  const { isWithin5Minutes } = usePartyCountdown(startsAt);
  const canViewInvitation = Boolean(inviteToken);
  const canRegisterTalkCalendar = Boolean(inviteToken && partyState.partyId);

  const showToast = useCallback((type: ToastState['type'], message: string) => {
    setToast({ id: Date.now(), type, message });
  }, []);
  const closeToast = useCallback(() => setToast(null), []);
  // 보호 라우트라 항상 로그인 상태 — 로그인 유도는 발생하지 않는다
  const openLoginPrompt = useCallback(() => undefined, []);

  const { isTalkCalendarPending, handleRegisterTalkCalendar } = useTalkCalendarReminder({
    partyId: String(partyState.partyId ?? ''),
    isAuthenticated: true,
    showToast,
    openLoginPrompt,
    returnLocation: reminderReturnLocation,
  });

  const handleViewInvitation = () => {
    if (!invitePath) return;
    navigate(invitePath);
  };

  return (
    <div className="party-complete-page relative flex min-h-dvh flex-col overflow-hidden px-5">
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

      <H1 className="party-complete-title mt-[clamp(24px,5svh,40px)] text-center">
        파티 초대장이 완성되었어요
      </H1>

      <div className="mx-auto mt-[clamp(24px,7svh,64px)] flex w-full max-w-[343px] flex-1 flex-col [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:flex-none">
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

        <div className="party-complete-button pb-safe-bottom-6 mt-auto [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:mt-10 [@media_(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(min-height:900px)]:pb-10">
          <div className="flex flex-col gap-2">
            <Button
              variant="white"
              size="full"
              disabled={!canViewInvitation}
              onClick={handleViewInvitation}
            >
              내 초대장 확인하기
            </Button>
            {!isWithin5Minutes && (
              <button
                type="button"
                className="text-body-2 bg-kakao-yellow disabled:bg-kakao-yellow inline-flex h-14 w-full cursor-pointer items-center justify-center gap-1 rounded-[12px] px-7 font-semibold text-black transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none active:translate-y-px active:brightness-[0.98] disabled:cursor-default disabled:text-black disabled:opacity-100"
                disabled={!canRegisterTalkCalendar || isTalkCalendarPending}
                aria-busy={isTalkCalendarPending}
                onClick={handleRegisterTalkCalendar}
              >
                <img src={iconChat} alt="" className="h-5 w-5" />
                파티 5분 전 카톡으로 알림받기
              </button>
            )}
          </div>
        </div>
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
