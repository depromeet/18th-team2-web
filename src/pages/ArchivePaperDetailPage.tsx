import { useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { MyPaperSection } from '@/components/archive/MyPaperSection';
import { PaperInfoSection } from '@/components/archive/PaperInfoSection';
import { StampHeroCard } from '@/components/archive/StampHeroCard';
import { SingleMessageModal } from '@/components/message/SingleMessageModal';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { H3 } from '@/components/ui/Typography';
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
    <div className="flex min-h-dvh flex-col bg-white pb-4">
      <header className="relative flex h-[42px] items-center px-4">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-[9px] flex h-6 w-6 items-center justify-center"
        >
          <ChevronLeftIcon className="text-grey-900" />
        </button>
        <H3 as="h1" className="mx-auto text-grey-900">
          {data.title}
        </H3>
      </header>

      <StampHeroCard id={data.id} stamp={data.stamp} />

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
    </div>
  );
}
