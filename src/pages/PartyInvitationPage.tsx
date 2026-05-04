import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { HostActions } from '@/components/party-invitation/HostActions';
import { HostTitle, ParticipantTitle } from '@/components/party-invitation/InvitationTitle';
import { InvitationCard } from '@/components/party-invitation/InvitationCard';
import { ParticipantActions } from '@/components/party-invitation/ParticipantActions';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { usePartyCountdown } from '@/hooks/usePartyCountdown';

// TODO: API 연동 시 교체
const MOCK_PARTY = {
  hostName: '김이라',
  startsAt: '2026-05-04T17:55:00', // KST
  role: 'host' as 'host' | 'participant',
};

export default function PartyInvitationPage() {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();

  const party = MOCK_PARTY;
  const { isWithin5Minutes } = usePartyCountdown(party.startsAt);
  const isHost = party.role === 'host';

  // TODO: API 연동 시 서버에서 작성 여부 조회
  const [hasWrittenRollingPaper, setHasWrittenRollingPaper] = useState(false);

  function handleEnterParty() {
    navigate(`/party/${partyId}/enter`);
  }

  function handleWriteRollingPaper() {
    setHasWrittenRollingPaper(true);
    navigate(`/party/${partyId}/rolling-paper/write`);
  }

  return (
    <MobileLayout>
      <main className="bg-gradient-bg flex min-h-screen flex-col">
        <section className="flex flex-1 flex-col items-center gap-7 px-4 pt-16">
          {isHost ? <HostTitle /> : <ParticipantTitle hostName={party.hostName} />}
          <InvitationCard hostName={party.hostName} startsAt={party.startsAt} isHost={isHost} />
        </section>

        <div className="fixed inset-x-0 bottom-0 z-10 mx-auto flex h-[110px] w-full max-w-150 items-end bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_40.91%)] px-4 pb-6">
          <div className="w-full">
            {isHost ? (
              <HostActions isWithin5Minutes={isWithin5Minutes} onEnterParty={handleEnterParty} />
            ) : (
              <ParticipantActions
                isWithin5Minutes={isWithin5Minutes}
                hasWrittenRollingPaper={hasWrittenRollingPaper}
                onEnterParty={handleEnterParty}
                onWriteRollingPaper={handleWriteRollingPaper}
              />
            )}
          </div>
        </div>
      </main>
    </MobileLayout>
  );
}
