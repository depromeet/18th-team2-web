import { useParams } from 'react-router-dom';

import { MobileLayout } from '@/components/layout/MobileLayout';
import { PartyEndedView } from '@/components/party-ended/PartyEndedView';
import { PartyInvitationView } from '@/components/party-invitation/PartyInvitationView';
import { usePartyInvite } from '@/services/party-invite';

export default function PartyInviteEntryPage() {
  const { inviteToken } = useParams<{ inviteToken: string }>();
  const { data, isLoading, isError } = usePartyInvite(inviteToken ?? '');

  if (!inviteToken) {
    return <InvalidLinkLayout message="잘못된 초대링크예요." />;
  }

  if (isLoading) {
    return <LoadingLayout />;
  }

  if (isError || !data) {
    return <InvalidLinkLayout message="만료되었거나 잘못된 초대링크예요." />;
  }

  const hostName = data.celebrantNickname ?? '';
  // TODO: API 응답에 isHost 플래그가 추가되면 교체
  const isHost = false;

  // 파티 종료 후 화면
  if (data.partyEnded) {
    const writableFrom = data.partyStartDate ? new Date(data.partyStartDate) : new Date();
    const writableUntil = data.partyEndDate ? new Date(data.partyEndDate) : new Date();

    return (
      <MobileLayout>
        <PartyEndedView
          inviteToken={inviteToken}
          hostName={hostName}
          writableFrom={writableFrom}
          writableUntil={writableUntil}
        />
      </MobileLayout>
    );
  }

  // 파티 시작 전 초대장 화면 — 실시간 파티는 liveStartAt, 그 외는 partyStartDate
  const startsAt = data.realtimeSchedule?.liveStartAt
    ? new Date(data.realtimeSchedule.liveStartAt)
    : data.partyStartDate
      ? new Date(data.partyStartDate)
      : new Date();

  return (
    <MobileLayout>
      <PartyInvitationView
        inviteToken={inviteToken}
        hostName={hostName}
        startsAt={startsAt}
        isHost={isHost}
        rollingPaperWritten={data.rollingPaperWritten ?? false}
      />
    </MobileLayout>
  );
}

function LoadingLayout() {
  return (
    <MobileLayout>
      <main className="bg-gradient-bg flex min-h-screen flex-col items-center justify-center">
        <p className="text-grey-500">초대장을 불러오는 중...</p>
      </main>
    </MobileLayout>
  );
}

function InvalidLinkLayout({ message }: { message: string }) {
  return (
    <MobileLayout>
      <main className="bg-gradient-bg flex min-h-screen flex-col items-center justify-center px-4">
        <p className="text-grey-700 text-center">{message}</p>
      </main>
    </MobileLayout>
  );
}
