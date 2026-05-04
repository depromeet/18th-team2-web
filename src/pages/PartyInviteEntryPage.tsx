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
  // TODO: BE PartyInviteLookupResponse에 isHost 추가되면 data.isHost로 교체
  // mock 한정 — 토큰에 'host' 포함되면 주최자 시점으로 시뮬레이션
  const isHost = inviteToken.includes('host');

  // 파티 종료 후 화면
  if (data.partyEnded) {
    if (!data.partyStartDate || !data.partyEndDate) {
      return <InvalidLinkLayout message="파티 정보를 불러올 수 없어요." />;
    }
    const writableFrom = new Date(data.partyStartDate);
    const writableUntil = new Date(data.partyEndDate);

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
  const startsAtSource = data.realtimeSchedule?.liveStartAt ?? data.partyStartDate;
  if (!startsAtSource) {
    return <InvalidLinkLayout message="파티 정보를 불러올 수 없어요." />;
  }
  const startsAt = new Date(startsAtSource);

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
