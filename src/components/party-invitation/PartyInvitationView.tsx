import { useCallback, useEffect, useRef, useState } from 'react';
import type { Location } from 'react-router-dom';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';

import defaultInvitationCharacter from '@/assets/images/character/character-blue-party-hat.png';
import shareIcon from '@/assets/icons/icon-share.svg';
import trashIcon from '@/assets/icons/icon-fill-trash.svg';
import { HostActions } from '@/components/party-invitation/HostActions';
import { InvitationCard } from '@/components/party-invitation/InvitationCard';
import { HostTitle, ParticipantTitle } from '@/components/party-invitation/InvitationTitle';
import { ParticipantActions } from '@/components/party-invitation/ParticipantActions';
import { PartyDeleteDialog } from '@/components/party-invitation/PartyDeleteDialog';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { LoginPromptSheet } from '@/components/ui/LoginPromptSheet';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { Toast, type ToastState } from '@/components/ui/Toast';
import { ROUTES } from '@/constants/routes';
import { usePartyCountdown } from '@/hooks/usePartyCountdown';
import { ApiError } from '@/services/api';
import { useDeleteParty } from '@/services/party';
import { useJoinPartyInvite } from '@/services/party-invite';
import {
  useIssueTalkCalendarConsentUrl,
  useRegisterPartyTalkCalendar,
} from '@/services/talk-calendar';
import { useAuthStore } from '@/stores/useAuthStore';
import { buildRollingPaperWritePath } from '@/utils/rollingPaperWrite';

const activeInvitationButtonClassName =
  'bg-[linear-gradient(111deg,#5892FC_20.81%,#3444F3_70.81%)] shadow-[5px_5px_14px_#8FB6FF]';
const CALENDAR_CONSENT_REQUIRED_CODE = 'KAKAO_CALENDAR_CONSENT_REQUIRED';
const CALENDAR_REMINDER_QUERY_KEY = 'talkCalendarReminder';

function buildTalkCalendarReturnPath(location: Location, includeReminder = false) {
  const params = new URLSearchParams(location.search);
  params.delete('calendarConsent');
  params.delete(CALENDAR_REMINDER_QUERY_KEY);

  if (includeReminder) {
    params.set(CALENDAR_REMINDER_QUERY_KEY, '1');
  }

  const search = params.toString();
  return `${location.pathname}${search ? `?${search}` : ''}`;
}

function getCalendarConsentMessage(calendarConsent: string) {
  switch (calendarConsent) {
    case 'denied':
      return '카카오 톡캘린더 동의가 취소되었어요.';
    case 'account_mismatch':
      return '로그인한 카카오 계정이 달라 알림을 등록할 수 없어요.';
    case 'expired':
      return '카카오 톡캘린더 동의 시간이 만료되었어요. 다시 시도해주세요.';
    case 'failed':
      return '카카오 톡캘린더 동의 처리에 실패했어요. 다시 시도해주세요.';
    default:
      return '카카오 톡캘린더 알림을 등록할 수 없어요. 다시 시도해주세요.';
  }
}

interface PartyInvitationViewProps {
  partyId: string;
  inviteToken: string;
  hostName: string;
  startsAt: Date;
  endsAt?: Date;

  isHost: boolean;
  rollingPaperWritten: boolean;
  partyOption: 'REALTIME' | 'PAPER_ONLY';
}

export function PartyInvitationView({
  partyId,
  inviteToken,
  hostName,
  startsAt,

  isHost,
  rollingPaperWritten,
  partyOption,
}: PartyInvitationViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isWithin5Minutes } = usePartyCountdown(startsAt);

  const [hasWrittenRollingPaper, setHasWrittenRollingPaper] = useState(rollingPaperWritten);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteParty, isPending: isDeletingParty } = useDeleteParty();
  const { mutate: joinPartyInvite, isPending: isJoining } = useJoinPartyInvite();
  const { mutate: registerTalkCalendar, isPending: isRegisteringTalkCalendar } =
    useRegisterPartyTalkCalendar();
  const { mutate: issueTalkCalendarConsentUrl, isPending: isIssuingTalkCalendarConsentUrl } =
    useIssueTalkCalendarConsentUrl();
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [hasRegisteredTalkCalendar, setHasRegisteredTalkCalendar] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const handledTalkCalendarReturnRef = useRef(false);
  const inviteLink = `${window.location.origin}${window.location.pathname}`;
  const canDelete = isHost && startsAt.getTime() > Date.now();
  const isTalkCalendarPending = isRegisteringTalkCalendar || isIssuingTalkCalendarConsentUrl;
  const showToast = useCallback((type: ToastState['type'], message: string) => {
    setToast({ id: Date.now(), type, message });
  }, []);

  const handleTalkCalendarError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiError && error.code === CALENDAR_CONSENT_REQUIRED_CODE) {
        issueTalkCalendarConsentUrl(buildTalkCalendarReturnPath(location, true), {
          onSuccess: (res) => {
            const consentUrl = res.data?.consentUrl;

            if (!consentUrl) {
              showToast(
                'error',
                '카카오 톡캘린더 동의 URL을 받아오지 못했어요. 다시 시도해주세요.',
              );
              return;
            }

            window.location.href = consentUrl;
          },
          onError: () => {
            showToast('error', '카카오 톡캘린더 동의 URL을 받아오지 못했어요. 다시 시도해주세요.');
          },
        });
        return;
      }

      if (error instanceof ApiError && error.message) {
        showToast('error', error.message);
        return;
      }

      showToast('error', '카카오 톡캘린더 알림을 등록할 수 없어요. 다시 시도해주세요.');
    },
    [issueTalkCalendarConsentUrl, location, showToast],
  );

  const requestTalkCalendarRegistration = useCallback(() => {
    if (hasRegisteredTalkCalendar) {
      showToast('success', '이미 알림을 설정했어요.');
      return;
    }

    registerTalkCalendar(partyId, {
      onSuccess: (res) => {
        setHasRegisteredTalkCalendar(true);
        showToast(
          'success',
          res.data?.updated ? '이미 알림을 설정했어요.' : '카카오 톡캘린더 알림이 등록됐어요.',
        );
      },
      onError: handleTalkCalendarError,
    });
  }, [
    handleTalkCalendarError,
    hasRegisteredTalkCalendar,
    partyId,
    registerTalkCalendar,
    showToast,
  ]);

  function handleRegisterTalkCalendar() {
    if (!isAuthenticated) {
      useAuthStore.getState().setRedirectUrl(buildTalkCalendarReturnPath(location, true));
      setIsLoginPromptOpen(true);
      return;
    }

    requestTalkCalendarRegistration();
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const calendarConsent = params.get('calendarConsent');
    const shouldRegisterAfterLogin = params.get(CALENDAR_REMINDER_QUERY_KEY) === '1';

    if (!calendarConsent && !shouldRegisterAfterLogin) return;
    if (handledTalkCalendarReturnRef.current) return;

    handledTalkCalendarReturnRef.current = true;
    navigate(buildTalkCalendarReturnPath(location), { replace: true });

    if (calendarConsent && calendarConsent !== 'granted') {
      showToast('error', getCalendarConsentMessage(calendarConsent));
      return;
    }

    if (isAuthenticated) {
      requestTalkCalendarRegistration();
      return;
    }

    setIsLoginPromptOpen(true);
  }, [isAuthenticated, location, navigate, requestTalkCalendarRegistration, showToast]);

  function handleEnterParty() {
    const partyEnterPath = generatePath(ROUTES.partyEnter, { partyId });
    const from = generatePath(ROUTES.partyInvite, { inviteToken });
    if (isHost) {
      navigate(partyEnterPath, { state: { inviteToken, from, hostName } });
      return;
    }
    if (!isAuthenticated) {
      navigate(partyEnterPath, { state: { inviteToken, from, hostName } });
      return;
    }
    joinPartyInvite(inviteToken, {
      onSuccess: () => navigate(partyEnterPath, { state: { inviteToken, from, hostName } }),
    });
  }

  function handleViewRollingPaper() {
    navigate(generatePath(ROUTES.rollingPaper, { id: partyId }));
  }

  function handleWriteRollingPaper() {
    setHasWrittenRollingPaper(true);
    navigate(buildRollingPaperWritePath(partyId, inviteToken), {
      state: {
        completeCta: 'invite',
        invitePath: window.location.pathname,
        inviteToken,
        hostName,
      },
    });
  }

  function handleDeleteParty() {
    if (startsAt.getTime() <= Date.now()) return;

    deleteParty(partyId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        navigate(ROUTES.home, { replace: true });
      },
    });
  }

  const invitationActions =
    isHost && partyOption === 'PAPER_ONLY' ? (
      <div className="flex w-full flex-col gap-2">
        <Button
          className={activeInvitationButtonClassName}
          variant="primary"
          size="full"
          onClick={handleViewRollingPaper}
        >
          롤링페이퍼 확인하기
        </Button>
        <button
          type="button"
          className="text-label-1 flex h-9 w-full cursor-pointer items-center justify-center font-semibold text-blue-600 underline underline-offset-2"
          onClick={() => setIsShareSheetOpen(true)}
        >
          초대 링크 공유하기
        </button>
      </div>
    ) : isHost ? (
      <HostActions isWithin5Minutes={isWithin5Minutes} onEnterParty={handleEnterParty} />
    ) : (
      <ParticipantActions
        isWithin5Minutes={isWithin5Minutes}
        hasWrittenRollingPaper={hasWrittenRollingPaper}
        canEnterParty={partyOption === 'REALTIME'}
        isJoining={isJoining}
        onEnterParty={handleEnterParty}
        onWriteRollingPaper={handleWriteRollingPaper}
      />
    );

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

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-label-1 flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(0,0,0,0.7)] py-2 pr-3 pl-2.5 font-medium text-white backdrop-blur-[2px] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              onClick={() => setIsShareSheetOpen(true)}
            >
              <img src={shareIcon} alt="" aria-hidden="true" className="h-5 w-5" />
              공유하기
            </button>
            {canDelete && (
              <button
                type="button"
                aria-label="파티 삭제하기"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <img src={trashIcon} alt="" className="h-5 w-5" />
              </button>
            )}
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-150 flex-1 flex-col items-center gap-4 px-4 pt-[clamp(18px,4svh,42px)] pb-[calc(24px+env(safe-area-inset-bottom))] [@media_(max-height:740px)]:gap-3 [@media_(max-height:740px)]:pt-2">
          {isHost ? <HostTitle hostName={hostName} /> : <ParticipantTitle hostName={hostName} />}
          <img
            src={defaultInvitationCharacter}
            alt=""
            aria-hidden="true"
            className="h-[120px] w-[120px] object-contain [@media_(max-height:740px)]:h-[96px] [@media_(max-height:740px)]:w-[96px]"
          />
          <InvitationCard
            hostName={hostName}
            startsAt={startsAt}
            partyOption={partyOption}
            isHost={isHost}
            isWithin5Minutes={isWithin5Minutes}
            hasWrittenRollingPaper={hasWrittenRollingPaper}
            isRegisteringTalkCalendar={isTalkCalendarPending}
            onWriteRollingPaper={handleWriteRollingPaper}
            onViewRollingPaper={handleViewRollingPaper}
            onRegisterTalkCalendar={handleRegisterTalkCalendar}
          />
          <div className="mt-4 flex w-full max-w-[375px] flex-col items-center justify-end bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_40.91%)] pt-2 pb-[env(safe-area-inset-bottom)]">
            <div className="w-full max-w-[343px]">{invitationActions}</div>
          </div>
        </section>

        <LinkShareSheet
          isOpen={isShareSheetOpen}
          link={inviteLink}
          title="초대장 링크 공유하기"
          shareText="초대장이 도착했어요"
          onClose={() => setIsShareSheetOpen(false)}
        />
      </main>

      <PartyDeleteDialog
        isOpen={isDeleteDialogOpen}
        isPending={isDeletingParty}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteParty}
      />
      <LoginPromptSheet
        isOpen={isLoginPromptOpen}
        titlePrefix="카카오톡 알림을 받기 위해서는"
        onClose={() => setIsLoginPromptOpen(false)}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
