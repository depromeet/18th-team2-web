import { generatePath, useNavigate } from 'react-router-dom';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { L1 } from '@/components/ui/Typography';
import { ArchiveCard } from '@/components/home/ArchiveCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { PartyCard } from '@/components/home/PartyCard';
import { UpcomingPartyCard } from '@/components/home/UpcomingPartyCard';
import { PARTY_ROLE } from '@/constants/party';
import { ROUTES } from '@/constants/routes';
import { useArchiveList } from '@/services/archive';
import { useUpcomingParties } from '@/services/me';
import { useAuthStore } from '@/stores/useAuthStore';

import type { UpcomingParty } from '@/types/home';

// 카드 CTA → 이동 경로. 디자인상 primary 버튼만 목적지가 있고, 비활성 안내문은 null.
function getCardRoutePath(party: UpcomingParty): string | null {
  const { role, partyOption, isOpen, partyId, inviteToken } = party;

  if (partyOption === 'REALTIME') {
    // 입장 가능: 입장/시작하기 → 파티 입장
    if (isOpen) return partyId ? generatePath(ROUTES.partyEnter, { partyId }) : null;
    // 입장 전: 참가자만 초대장 확인, 주최자는 비활성
    return role === PARTY_ROLE.PARTICIPANT && inviteToken
      ? generatePath(ROUTES.partyInvite, { inviteToken })
      : null;
  }

  // PAPER_ONLY — 참가자: 롤페 작성 / 주최자: 공개 후 롤페 확인
  if (role === PARTY_ROLE.PARTICIPANT) {
    return partyId ? generatePath(ROUTES.rollingPaperWrite, { partyId }) : null;
  }
  return isOpen && partyId ? generatePath(ROUTES.rollingPaper, { id: partyId }) : null;
}

function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: archiveData } = useArchiveList();
  const archiveCount = isAuthenticated ? (archiveData?.totalCount ?? 0) : 0;
  const archivePreview = isAuthenticated ? archiveData?.items[0] : undefined;

  const { data: upcomingParties } = useUpcomingParties();
  const parties = upcomingParties ?? [];

  const handleCardAction = (party: UpcomingParty) => {
    const path = getCardRoutePath(party);
    if (!path) return;
    if (party.partyOption === 'REALTIME' && party.isOpen && party.partyId) {
      navigate(path, { state: { inviteToken: party.inviteToken } });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="bg-gradient-bg flex min-h-screen flex-col">
      <HomeHeader />
      <div className="flex flex-col gap-2">
        {parties.length > 0 && (
          <div className="flex flex-col items-center gap-3 py-2">
            {parties.length === 1 ? (
              <div className="w-full px-4">
                <UpcomingPartyCard
                  party={parties[0]}
                  onAction={() => handleCardAction(parties[0])}
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
                  {parties.map((party, index) => (
                    <SwiperSlide
                      key={party.partyId ?? `party-${index}`}
                      style={{ width: 'calc(100% - 32px)' }}
                    >
                      <UpcomingPartyCard party={party} onAction={() => handleCardAction(party)} />
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
