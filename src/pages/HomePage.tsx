import { generatePath, useNavigate } from 'react-router-dom';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { L1 } from '@/components/ui/Typography';
import { ArchiveCard } from '@/components/home/ArchiveCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { PartyCard } from '@/components/home/PartyCard';
import { UpcomingPartyCard } from '@/components/home/UpcomingPartyCard';
import { ROUTES } from '@/constants/routes';
import { useArchiveList } from '@/services/archive';
import { useAuthStore } from '@/stores/useAuthStore';

import type { UpcomingParty } from '@/components/home/UpcomingPartyCard';

// pre-launch: 하드코딩 partyId
const HARDCODED_PARTY_ID = '1';

function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: archiveItems } = useArchiveList();
  const archiveCount = isAuthenticated ? (archiveItems?.length ?? 0) : 0;
  const archivePreview = isAuthenticated ? archiveItems?.[0] : undefined;

  // TODO: BE API 연동 후 실제 데이터로 교체 — 7개 상태 확인용 mock
  const mockParties: UpcomingParty[] = isAuthenticated
    ? [
        {
          partyName: '홍길동님의 생일파티',
          date: '26.11.23',
          time: '오후 2:00',
          role: 'participant',
          status: 'soon',
        },
        {
          partyName: '내 생일파티',
          date: '26.11.23',
          time: '오후 2:00',
          role: 'host',
          status: 'default',
        },
        {
          partyName: '홍길동님의 생일파티',
          date: '26.11.23',
          time: '오후 2:00',
          role: 'participant',
          status: 'soon',
        },
        {
          partyName: '내 생일파티',
          date: '26.11.23',
          time: '오후 2:00',
          role: 'host',
          status: 'soon',
        },
        {
          partyName: '홍길동님의 롤링페이퍼',
          date: '26.11.23',
          endDate: '26.11.23',
          role: 'participant',
          status: 'rollingPaper',
        },
        {
          partyName: '내 롤링페이퍼',
          date: '26.11.23',
          endDate: '26.11.23',
          role: 'host',
          status: 'rollingPaper',
        },
        {
          partyName: '내 롤링페이퍼',
          date: '26.11.23',
          endDate: '26.11.23',
          role: 'host',
          status: 'rollingPaperOpen',
        },
      ]
    : [];

  const handleEnterParty = (party: UpcomingParty) => {
    if (party.status !== 'soon') {
      return;
    }

    navigate(
      generatePath(ROUTES.partyEnter, {
        partyId: HARDCODED_PARTY_ID,
      }),
    );
  };

  return (
    <div className="bg-gradient-bg flex min-h-screen flex-col">
      <HomeHeader />
      <div className="flex flex-col gap-2">
        {mockParties.length > 0 && (
          <div className="flex flex-col items-center gap-3 py-2">
            {mockParties.length === 1 ? (
              <div className="w-full px-4">
                <UpcomingPartyCard
                  party={mockParties[0]}
                  onAction={() => handleEnterParty(mockParties[0])}
                />
              </div>
            ) : (
              <>
                <Swiper
                  modules={[Pagination]}
                  slidesPerView="auto"
                  spaceBetween={8}
                  centeredSlides
                  loop
                  loopAdditionalSlides={1}
                  pagination={{
                    clickable: true,
                    el: '.upcoming-party-pagination',
                  }}
                  className="upcoming-party-swiper w-full"
                >
                  {mockParties.map((party, index) => (
                    <SwiperSlide key={`party-${index}`} style={{ width: 'calc(100% - 32px)' }}>
                      <UpcomingPartyCard
                        party={party}
                        onAction={
                          party.status === 'soon'
                            ? () =>
                                navigate(
                                  generatePath(ROUTES.partyEnter, {
                                    partyId: HARDCODED_PARTY_ID,
                                  }),
                                )
                            : undefined
                        }
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="upcoming-party-pagination flex items-center justify-center gap-2" />
              </>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2.25 px-4 py-5">
          <h2 className="text-head-2 font-bold tracking-tight">
            오늘은 누구의 생일을
            <br />
            축하해볼까요?
          </h2>
          <L1 className="text-grey-400 font-medium">
            축하가 끝난 뒤에는 롤링페이퍼도 함께 보낼 수 있어요
          </L1>
        </div>
        <div className="px-4">
          <PartyCard />
        </div>
        <ArchiveCard count={archiveCount} previewItem={archivePreview} />
      </div>
    </div>
  );
}

export default HomePage;
