import { useCallback, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { L1 } from '@/components/ui/Typography';
import { ArchiveCard } from '@/components/home/ArchiveCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { PartyCard } from '@/components/home/PartyCard';
import { UpcomingPartyCard } from '@/components/home/UpcomingPartyCard';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { ROUTES } from '@/constants/routes';
import { useArchiveList } from '@/services/archive';
import { useUpcomingParties } from '@/services/me';
import { useAuthStore } from '@/stores/useAuthStore';
import { getCardRoutePath } from '@/utils/homeRoute';
import { canShareParty } from '@/utils/party';

import type { UpcomingParty } from '@/types/home';

function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: archiveData } = useArchiveList();
  const archiveCount = isAuthenticated ? (archiveData?.totalCount ?? 0) : 0;
  const archivePreview = isAuthenticated ? archiveData?.items[0] : undefined;

  const { data: upcomingParties } = useUpcomingParties();
  const parties = upcomingParties ?? [];

  // 호스트 카드 '링크 복사' → 공유 시트. 공유할 파티의 inviteToken을 보관.
  const [shareToken, setShareToken] = useState<string | null>(null);
  const shareLink = shareToken
    ? `${window.location.origin}${generatePath(ROUTES.partyInvite, { inviteToken: shareToken })}`
    : '';

  const handleCardShare = useCallback((party: UpcomingParty) => {
    // 카드의 링크 복사 노출 규칙과 동일 기준으로 가드 (canShareParty 단일 소스)
    if (!canShareParty(party) || !party.inviteToken) return;
    setShareToken(party.inviteToken);
  }, []);

  const handleCardAction = (party: UpcomingParty) => {
    const path = getCardRoutePath(party);
    if (!path) return;
    navigate(path);
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
                  onShare={() => handleCardShare(parties[0])}
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
                      <UpcomingPartyCard
                        party={party}
                        onAction={() => handleCardAction(party)}
                        onShare={() => handleCardShare(party)}
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

      <LinkShareSheet
        isOpen={shareToken !== null}
        link={shareLink}
        title="초대장 링크 공유하기"
        shareText="파티 초대장이 도착했어요"
        onClose={() => setShareToken(null)}
      />
    </div>
  );
}

export default HomePage;
