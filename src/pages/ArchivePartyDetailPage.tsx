import { useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { ArchiveDetailLayout } from '@/components/archive/ArchiveDetailLayout';
import { MyPaperSection } from '@/components/archive/MyPaperSection';
import { ParticipantsSection } from '@/components/archive/ParticipantsSection';
import { PartyChatSection } from '@/components/archive/PartyChatSection';
import { PartyInfoSection } from '@/components/archive/PartyInfoSection';
import { SingleMessageModal } from '@/components/message/SingleMessageModal';
import { ROUTES } from '@/constants/routes';
import { useArchivePartyDetail } from '@/services/archive';

export default function ArchivePartyDetailPage() {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();
  const { data } = useArchivePartyDetail(partyId ?? '');
  const [paperOpen, setPaperOpen] = useState(false);

  if (!data) return null;

  const isHost = data.role === 'HOST';
  const showPaperSection = isHost || (data.myPaperWritten && data.myPaperContent);

  const handlePaperClick = () => {
    if (isHost) {
      navigate(generatePath(ROUTES.rollingPaper, { id: data.id }));
    } else {
      setPaperOpen(true);
    }
  };

  return (
    <ArchiveDetailLayout title={data.partyName} id={data.id} stamp={data.stamp}>
      <PartyInfoSection
        partyName={data.partyName}
        date={data.date}
        time={data.time}
        participantCount={data.participantCount}
        role={data.role}
      />

      <ParticipantsSection count={data.participantCount} participants={data.participants} />

      {showPaperSection && (
        <MyPaperSection
          buttonLabel={isHost ? '롤링페이퍼 보러가기' : '내가 남긴 롤링페이퍼 보기'}
          count={isHost ? data.paperCount : undefined}
          onClick={handlePaperClick}
        />
      )}

      {data.chatMessages.length > 0 && <PartyChatSection messages={data.chatMessages} />}

      {paperOpen && data.myPaperContent && (
        <SingleMessageModal
          content={data.myPaperContent}
          writerName="나"
          onClose={() => setPaperOpen(false)}
        />
      )}
    </ArchiveDetailLayout>
  );
}
