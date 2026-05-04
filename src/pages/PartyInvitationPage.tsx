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
  startsAt: '2026-11-26T07:00:00Z', // UTC → KST 16:00
  role: 'participant' as 'host' | 'participant',
};

export default function PartyInvitationPage() {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();

  const party = MOCK_PARTY;
  const { isWithin5Minutes } = usePartyCountdown(party.startsAt);
  const isHost = party.role === 'host';

  function handleEnterParty() {
    navigate(`/party/${partyId}/enter`);
  }

  function handleWriteRollingPaper() {
    navigate(`/party/${partyId}/rolling-paper/write`);
  }

  return (
    <MobileLayout>
      <main className="flex min-h-screen flex-col bg-gradient-bg">
        <section className="flex flex-1 flex-col items-center gap-7 px-4 pt-16">
          {isHost ? (
            <HostTitle />
          ) : (
            <ParticipantTitle hostName={party.hostName} />
          )}
          <InvitationCard hostName={party.hostName} startsAt={party.startsAt} />
        </section>

        <footer className="px-4 pb-8 pt-4">
          {isHost ? (
            <HostActions isWithin5Minutes={isWithin5Minutes} onEnterParty={handleEnterParty} />
          ) : (
            <ParticipantActions
              isWithin5Minutes={isWithin5Minutes}
              onEnterParty={handleEnterParty}
              onWriteRollingPaper={handleWriteRollingPaper}
            />
          )}
        </footer>
      </main>
    </MobileLayout>
  );
}
