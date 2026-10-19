import { useCallback, useEffect, useState } from 'react';
import { generatePath, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { H2, H4, L1 } from '@/components/ui/Typography';
import { ArchiveCard } from '@/components/home/ArchiveCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { UpcomingPartyCard } from '@/components/home/UpcomingPartyCard';
import { RollingPaperArchiveNoticeSheet } from '@/components/rolling-paper/RollingPaperArchiveNoticeSheet';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { ROUTES } from '@/constants/routes';
import { useArchiveList } from '@/services/archive';
import { useUpcomingParties } from '@/services/me';
import { useAuthStore } from '@/stores/useAuthStore';
import { getCardRoutePath } from '@/utils/homeRoute';
import { canShareParty } from '@/utils/party';

import type { UpcomingParty } from '@/types/home';
import { ONBOARDING_SEEN_KEY } from '@/constants/onboarding';
import { LivePartyCard } from '@/components/home/LivePartyCard';
import { RollingPaperCard } from '@/components/home/RollingPaperCard';

interface HomeLocationState {
  rollingPaperArchiveNotice?: {
    partyId: string;
    partyName: string;
    date?: string;
  };
}

function PartyAlternativeDivider() {
  return (
    <div className="flex w-full items-center justify-center gap-2 py-2">
      <span className="bg-grey-100 h-px max-w-41.5 min-w-[57.5px] flex-1" />
      <span className="bg-grey-100 size-1 shrink-0 rounded-full" />
      <L1 className="text-grey-700/60 shrink-0 whitespace-nowrap">파티가 부담스럽다면?</L1>
      <span className="bg-grey-100 size-1 shrink-0 rounded-full" />
      <span className="bg-grey-100 h-px max-w-41.5 min-w-[57.5px] flex-1" />
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as HomeLocationState | null;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: archiveData } = useArchiveList();
  const { data: upcomingParties } = useUpcomingParties();
  const [shareParty, setShareParty] = useState<UpcomingParty | null>(null);
  const [archiveNotice, setArchiveNotice] = useState(
    locationState?.rollingPaperArchiveNotice ?? null,
  );

  const archiveCount = isAuthenticated ? (archiveData?.totalCount ?? 0) : 0;
  const archivePreview = isAuthenticated ? archiveData?.items[0] : undefined;
  const parties = upcomingParties ?? [];
  const shareLink = shareParty?.inviteToken
    ? `${window.location.origin}${generatePath(ROUTES.partyInvite, {
        inviteToken: shareParty.inviteToken,
      })}`
    : '';
  const isRollingPaperShare =
    shareParty?.partyOption === 'REALTIME' && shareParty.isEnded && shareParty.role === 'HOST';

  const handleCardShare = useCallback((party: UpcomingParty) => {
    if (!canShareParty(party) || !party.inviteToken) return;
    setShareParty(party);
  }, []);

  useEffect(() => {
    if (!locationState?.rollingPaperArchiveNotice) return;

    setArchiveNotice(locationState.rollingPaperArchiveNotice);
    navigate(ROUTES.home, { replace: true, state: null });
  }, [locationState?.rollingPaperArchiveNotice, navigate]);

  if (!isAuthenticated && !sessionStorage.getItem(ONBOARDING_SEEN_KEY)) {
    return <Navigate to={ROUTES.onboarding} replace />;
  }

  const handleCardAction = (party: UpcomingParty) => {
    const path = getCardRoutePath(party);
    if (!path) return;
    navigate(path);
  };

  return (
    <div className="bg-gradient-bg flex min-h-dvh flex-col overflow-x-hidden">
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
          <H2 className="tracking-tight">특별한 날을 기념해 볼까요?</H2>
          <H4 className="text-grey-500 font-medium!">당일이 아니라도, 미리 만들어 둘 수 있어요</H4>
        </div>
        <div className="flex flex-col gap-2.25 px-4">
          <LivePartyCard />
          <PartyAlternativeDivider />
          <RollingPaperCard />
        </div>
        <ArchiveCard count={archiveCount} previewItem={archivePreview} />
      </div>

      <LinkShareSheet
        isOpen={shareParty !== null}
        link={shareLink}
        title={isRollingPaperShare ? '롤링페이퍼 링크 공유하기' : '초대장 링크 공유하기'}
        shareText={
          isRollingPaperShare ? '롤링페이퍼 작성 초대장이 왔어요' : '파티 초대장이 도착했어요'
        }
        onClose={() => setShareParty(null)}
      />

      {archiveNotice && (
        <RollingPaperArchiveNoticeSheet
          isOpen
          partyId={archiveNotice.partyId}
          partyName={archiveNotice.partyName}
          date={archiveNotice.date}
          onClose={() => setArchiveNotice(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
