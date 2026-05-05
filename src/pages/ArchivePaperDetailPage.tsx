import { useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { ArchiveDetailLayout } from '@/components/archive/ArchiveDetailLayout';
import { MyPaperSection } from '@/components/archive/MyPaperSection';
import { PaperInfoSection } from '@/components/archive/PaperInfoSection';
import { SingleMessageModal } from '@/components/message/SingleMessageModal';
import { ROUTES } from '@/constants/routes';
import { useArchivePaperDetail } from '@/services/archive';

export default function ArchivePaperDetailPage() {
  const { wrapperId } = useParams<{ wrapperId: string }>();
  const navigate = useNavigate();
  const { data } = useArchivePaperDetail(wrapperId ?? '');
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
    <ArchiveDetailLayout title={data.title} id={data.id} stamp={data.stamp}>
      <PaperInfoSection title={data.title} startDate={data.startDate} endDate={data.endDate} />

      {showPaperSection && (
        <MyPaperSection
          buttonLabel={isHost ? '롤링페이퍼 보러가기' : '내가 남긴 롤링페이퍼 보기'}
          count={isHost ? data.paperCount : undefined}
          onClick={handlePaperClick}
        />
      )}

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
