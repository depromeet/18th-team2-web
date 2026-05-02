import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { MobileLayout } from '@/components/layout/MobileLayout';
import { H2, L1 } from '@/components/ui/Typography';
import { ArchiveCard } from '@/components/home/ArchiveCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { PartyCard } from '@/components/home/PartyCard';
import { UpcomingPartyCard } from '@/components/home/UpcomingPartyCard';
import { useAuthStore } from '@/stores/useAuthStore';

import type { UpcomingParty } from '@/components/home/UpcomingPartyCard';

function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // TODO: BE API 연동 후 실제 데이터로 교체
  const mockParties: UpcomingParty[] = isAuthenticated
    ? [
        {
          partyName: '홍길동님의 생일파티',
          date: '26.11.23  오후 2:00',
          role: 'participant',
          status: 'default',
        },
        {
          partyName: '김철수님의 생일파티',
          date: '26.11.25  오후 3:00',
          role: 'host',
          status: 'soon',
        },
      ]
    : [];

  return (
    <MobileLayout>
      <div className="bg-gradient-bg flex min-h-screen flex-col">
        <HomeHeader />
        <div className="flex flex-col gap-2 px-4">
          {mockParties.length > 0 && (
            <div className="py-2">
              {mockParties.length === 1 ? (
                <UpcomingPartyCard party={mockParties[0]} />
              ) : (
                <Swiper
                  modules={[Pagination]}
                  slidesPerView={1}
                  spaceBetween={8}
                  pagination={{ clickable: true }}
                >
                  {mockParties.map((party, index) => (
                    <SwiperSlide key={`party-${index}`}>
                      <UpcomingPartyCard party={party} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          )}
          <div className="flex flex-col gap-2.25 py-5">
            <H2 className="font-bold">
              오늘은 누구의 생일을
              <br />
              축하해볼까요?
            </H2>
            <L1 className="text-grey-400">축하가 끝난 뒤에는 롤링페이퍼도 함께 보낼 수 있어요</L1>
          </div>
          <PartyCard />
          <ArchiveCard count={isAuthenticated ? 8 : 0} />
        </div>
      </div>
    </MobileLayout>
  );
}

export default HomePage;
