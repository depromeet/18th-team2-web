import { useCallback, useEffect, useState } from 'react';
import { generatePath, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';

import { PartyEndedView } from '@/components/party-ended/PartyEndedView';
import { PartyInvitationView } from '@/components/party-invitation/PartyInvitationView';
import { ErrorView } from '@/components/ui/ErrorView';
import { Toast, type ToastState } from '@/components/ui/Toast';
import { ROUTES } from '@/constants/routes';
import { getRollingPaperWritableUntil, usePartyInvite } from '@/services/party-invite';
import { isApiErrorStatus } from '@/utils/api-error';
import { parseKstDateTime } from '@/utils/date';

const CALENDAR_CONSENT_QUERY_KEY = 'calendarConsent';
const CALENDAR_REMINDER_QUERY_KEY = 'talkCalendarReminder';

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

function buildCleanInvitePath(pathname: string, search: string) {
  const params = new URLSearchParams(search);
  params.delete(CALENDAR_CONSENT_QUERY_KEY);
  params.delete(CALENDAR_REMINDER_QUERY_KEY);

  const cleanSearch = params.toString();
  return `${pathname}${cleanSearch ? `?${cleanSearch}` : ''}`;
}

export default function PartyInviteEntryPage() {
  const { inviteToken } = useParams<{ inviteToken: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as {
    rollingPaperWritten?: boolean;
  } | null;
  const [toast, setToast] = useState<ToastState | null>(null);
  const calendarConsent = new URLSearchParams(location.search).get(CALENDAR_CONSENT_QUERY_KEY);
  const hasFailedCalendarConsent = Boolean(calendarConsent && calendarConsent !== 'granted');
  const { data, isLoading, isError, error, refetch } = usePartyInvite(inviteToken ?? '', {
    enabled: !hasFailedCalendarConsent,
  });
  const showToast = useCallback((type: ToastState['type'], message: string) => {
    setToast({ id: Date.now(), type, message });
  }, []);

  useEffect(() => {
    if (!calendarConsent || calendarConsent === 'granted') return;

    navigate(buildCleanInvitePath(location.pathname, location.search), { replace: true });
    showToast('error', getCalendarConsentMessage(calendarConsent));
  }, [calendarConsent, location.pathname, location.search, navigate, showToast]);

  const toastNode = <Toast toast={toast} onClose={() => setToast(null)} />;

  if (!inviteToken) {
    return (
      <>
        <InvalidLinkLayout message="잘못된 초대링크예요." />
        {toastNode}
      </>
    );
  }

  if (hasFailedCalendarConsent) {
    return (
      <>
        <LoadingLayout />
        {toastNode}
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <LoadingLayout />
        {toastNode}
      </>
    );
  }

  if (isError || !data) {
    if (isApiErrorStatus(error, 404) || isApiErrorStatus(error, 403)) {
      return (
        <>
          <ErrorView variant="notFound" onPrimaryClick={() => navigate(ROUTES.home)} />
          {toastNode}
        </>
      );
    }

    if (isApiErrorStatus(error, 400)) {
      return (
        <>
          <ErrorView
            variant="notFound"
            title="사용할 수 없는 초대링크예요"
            description="만료되었거나 잘못된 초대링크예요."
            onPrimaryClick={() => navigate(ROUTES.home)}
          />
          {toastNode}
        </>
      );
    }

    return (
      <>
        <ErrorView
          variant="retry"
          onPrimaryClick={() => void refetch()}
          onSecondaryClick={() => navigate(-1)}
        />
        {toastNode}
      </>
    );
  }

  const hostName = data.celebrantNickname ?? '';
  const liveEndAt = data.realtimeSchedule?.liveEndAt
    ? parseKstDateTime(data.realtimeSchedule.liveEndAt).toDate()
    : undefined;
  const isRealtimeLiveEnded = Boolean(
    data.partyOption === 'REALTIME' && liveEndAt && liveEndAt.getTime() <= Date.now(),
  );
  const isRealtimeClosed =
    data.partyOption === 'REALTIME' &&
    (data.realtimeStatus === 'LIVE_ENDING' ||
      data.realtimeStatus === 'LIVE_CLOSED' ||
      data.realtimeStatus === 'ROLLING_PAPER_CLOSED');

  // 파티 종료 후 화면
  if (data.partyEnded || isRealtimeClosed || isRealtimeLiveEnded) {
    if (data.isHost) {
      return <Navigate to={generatePath(ROUTES.rollingPaper, { id: data.partyId })} replace />;
    }

    if (!data.partyStartDate || !data.partyEndDate) {
      return <InvalidLinkLayout message="파티 정보를 불러올 수 없어요." />;
    }

    return (
      <PartyEndedView
        partyId={data.partyId}
        inviteToken={inviteToken}
        hostName={hostName}
        writableFrom={new Date(data.partyStartDate)}
        writableUntil={getRollingPaperWritableUntil(data)}
      />
    );
  }

  // 파티 시작 전 초대장 화면 — 실시간 파티는 liveStartAt, 그 외는 partyStartDate
  const startsAtSource = data.realtimeSchedule?.liveStartAt ?? data.partyStartDate;
  if (!startsAtSource) {
    return <InvalidLinkLayout message="파티 정보를 불러올 수 없어요." />;
  }

  return (
    <PartyInvitationView
      partyId={data.partyId}
      inviteToken={inviteToken}
      hostName={hostName}
      startsAt={new Date(startsAtSource)}
      endsAt={data.partyEndDate ? new Date(data.partyEndDate) : undefined}
      isHost={data.isHost}
      rollingPaperWritten={locationState?.rollingPaperWritten ?? data.rollingPaperWritten}
      partyOption={data.partyOption ?? 'REALTIME'}
    />
  );
}

function LoadingLayout() {
  return (
    <main className="bg-gradient-bg flex min-h-dvh flex-col items-center justify-center">
      <p className="text-grey-500">초대장을 불러오는 중...</p>
    </main>
  );
}

function InvalidLinkLayout({ message }: { message: string }) {
  return (
    <main className="bg-gradient-bg flex min-h-dvh flex-col items-center justify-center px-4">
      <p className="text-grey-700 text-center">{message}</p>
    </main>
  );
}
