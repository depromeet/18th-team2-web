import { useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { ArchiveDetailLayout } from '@/components/archive/ArchiveDetailLayout';
import { MyPaperSection } from '@/components/archive/MyPaperSection';
import { PaperInfoSection } from '@/components/archive/PaperInfoSection';
import { SingleMessageModal } from '@/components/message/SingleMessageModal';
import { ROUTES } from '@/constants/routes';
import { useArchiveDetail } from '@/services/archive';

export default function ArchivePaperDetailPage() {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useArchiveDetail(partyId ?? '');
  const [paperOpen, setPaperOpen] = useState(false);

  if (!partyId) return null;
  if (isLoading) return null;
  if (isError || !data) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-white px-4">
        <p className="text-grey-700 text-center">보관함 정보를 불러올 수 없어요.</p>
      </main>
    );
  }

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
      <PaperInfoSection title={data.partyName} startDate={data.date} endDate={data.endDate} />

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
          writerName={data.myPaperWriterNickname ?? '나'}
          onClose={() => setPaperOpen(false)}
        />
      )}
    </ArchiveDetailLayout>
  );
}
