import { useEffect, useState } from 'react';
import { generatePath, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';

import { PartyEndedView } from '@/components/party-ended/PartyEndedView';
import { PartyInvitationView } from '@/components/party-invitation/PartyInvitationView';
import { ErrorView } from '@/components/ui/ErrorView';
import { ROUTES } from '@/constants/routes';
import { getRealtimePartyState } from '@/services/live-party';
import { getRollingPaperWritableUntil, usePartyInvite } from '@/services/party-invite';
import { isApiErrorStatus } from '@/utils/api-error';
import { parseKstDateTime } from '@/utils/date';

export default function PartyInviteEntryPage() {
  const { inviteToken } = useParams<{ inviteToken: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as {
    rollingPaperWritten?: boolean;
    showRealtimeEndingView?: boolean;
  } | null;
  const { data, isLoading, isError, error, refetch } = usePartyInvite(inviteToken ?? '');
  const [showRealtimeEndingView, setShowRealtimeEndingView] = useState(
    Boolean(locationState?.showRealtimeEndingView),
  );
  const [isCheckingRealtimeState, setIsCheckingRealtimeState] = useState(false);

  useEffect(() => {
    if (!data || data.partyOption !== 'REALTIME' || data.partyEnded || showRealtimeEndingView) {
      return;
    }

    let ignore = false;
    setIsCheckingRealtimeState(true);

    getRealtimePartyState(data.partyId)
      .then((state) => {
        if (!ignore && state?.status === 'LIVE_ENDING') {
          setShowRealtimeEndingView(true);
        }
      })
      .catch(() => {
        // 상태 확인 실패 시 기존 초대장 흐름을 유지한다.
      })
      .finally(() => {
        if (!ignore) {
          setIsCheckingRealtimeState(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [data, showRealtimeEndingView]);

  if (!inviteToken) {
    return <InvalidLinkLayout message="잘못된 초대링크예요." />;
  }

  if (isLoading) {
    return <LoadingLayout />;
  }

  if (isError || !data) {
    if (isApiErrorStatus(error, 404) || isApiErrorStatus(error, 403)) {
      return <ErrorView variant="notFound" onPrimaryClick={() => navigate(ROUTES.home)} />;
    }

    if (isApiErrorStatus(error, 400)) {
      return (
        <ErrorView
          variant="notFound"
          title="사용할 수 없는 초대링크예요"
          description="만료되었거나 잘못된 초대링크예요."
          onPrimaryClick={() => navigate(ROUTES.home)}
        />
      );
    }

    return (
      <ErrorView
        variant="retry"
        onPrimaryClick={() => void refetch()}
        onSecondaryClick={() => navigate(-1)}
      />
    );
  }

  const hostName = data.celebrantNickname ?? '';
  const liveEndAt = data.realtimeSchedule?.liveEndAt
    ? parseKstDateTime(data.realtimeSchedule.liveEndAt).toDate()
    : undefined;
  const isRealtimeLiveEnded = Boolean(
    data.partyOption === 'REALTIME' && liveEndAt && liveEndAt.getTime() <= Date.now(),
  );
  const isRealtimeEnding = showRealtimeEndingView;

  if (isCheckingRealtimeState) {
    return <LoadingLayout />;
  }

  // 파티 종료 후 화면
  if (data.partyEnded || isRealtimeEnding || isRealtimeLiveEnded) {
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
      isHost={data.isHost}
      rollingPaperWritten={locationState?.rollingPaperWritten ?? data.rollingPaperWritten ?? false}
      partyOption={data.partyOption ?? 'REALTIME'}
      onRealtimePartyEnding={() => setShowRealtimeEndingView(true)}
    />
  );
}

function LoadingLayout() {
  return (
    <main className="bg-gradient-bg flex min-h-screen flex-col items-center justify-center">
      <p className="text-grey-500">초대장을 불러오는 중...</p>
    </main>
  );
}

function InvalidLinkLayout({ message }: { message: string }) {
  return (
    <main className="bg-gradient-bg flex min-h-screen flex-col items-center justify-center px-4">
      <p className="text-grey-700 text-center">{message}</p>
    </main>
  );
}
