import { useState } from 'react';
import { generatePath, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';

import { Button } from '@/components/ui/Button';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { B1, T4 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import type { components } from '@/types/api';
import noOwnerImage from '@/assets/images/live-party/no-owner.svg';
import loadingBarAnimation from '@/assets/images/live-party/loading-bar.json';

type PartyParticipant = components['schemas']['PartyParticipantResponse'];

interface HostNotEnterProps {
  participants: PartyParticipant[];
}

export function HostNotEnter({ participants }: HostNotEnterProps) {
  const location = useLocation();
  const locationState = location.state as { inviteToken?: string } | null;
  const inviteToken = locationState?.inviteToken ?? '';
  const waitingParticipantCount = Math.max(participants.length - 1, 0);

  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  const shareLink = inviteToken
    ? `${window.location.origin}${generatePath(ROUTES.partyInvite, { inviteToken })}`
    : '';

  return (
    <>
      <div className="flex h-full w-full flex-col px-4">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-15 [@media_(max-height:700px)]:gap-10">
            <div className="relative">
              <img src={noOwnerImage} alt="" aria-hidden className="h-20 w-20" />
            </div>

            <div className="flex flex-col items-center gap-4 text-center [@media_(max-height:700px)]:gap-3">
              <T4 className="text-white">
                아직 주인공이
                <br />
                입장하지 않았어요
              </T4>

              <B1 className="text-white/80">
                <span className="font-semibold">{waitingParticipantCount}명</span>이 함께 기다리는
                중
              </B1>
            </div>

            <Lottie animationData={loadingBarAnimation} className="h-9 w-9" loop />
          </div>
        </div>

        <div className="pb-[calc(env(safe-area-inset-bottom)+24px)] [@media_(max-height:700px)]:pb-[calc(env(safe-area-inset-bottom)+16px)]">
          <Button variant="white" size="full" onClick={() => setIsShareSheetOpen(true)}>
            주인공에게 입장 링크 보내기
          </Button>
        </div>
      </div>

      <LinkShareSheet
        isOpen={isShareSheetOpen}
        link={shareLink}
        title="주인공에게 입장 링크 보내기"
        shareText="친구들이 파티방에서 애타게 기다리고 있어요."
        onClose={() => setIsShareSheetOpen(false)}
      />
    </>
  );
}
