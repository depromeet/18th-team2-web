import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { LinkShareSheet } from '@/components/ui/LinkShareSheet';
import { B1, T4 } from '@/components/ui/Typography';
import { ParticipantAvatarGroup } from '@/components/live-party/ParticipantAvatarGroup';
import type { components } from '@/types/api';

type PartyParticipant = components['schemas']['PartyParticipantResponse'];

interface HostNotEnterProps {
  participants: PartyParticipant[];
}

export function HostNotEnter({ participants }: HostNotEnterProps) {
  const { partyId = '' } = useParams();

  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  {
    /**TODO: 수정 필요 */
  }
  const shareLink = `${window.location.origin}/party/${partyId}/enter`;

  return (
    <>
      <div className="flex h-full w-full flex-col px-4">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-15">
            <div className="relative">
              {/**TODO: 이미지 추가 필요 */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                임시이미지
              </div>

              {participants.length > 1 && (
                <div className="absolute right-[-2px] bottom-[-5px] z-10">
                  <ParticipantAvatarGroup participants={participants.slice(0, 3)} size="lg" />
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <T4 className="text-white">
                아직 주인공이
                <br />
                입장하지 않았어요
              </T4>

              <B1 className="text-white/80">
                <span className="font-semibold">{participants.length - 1}명</span>이 함께 기다리는
                중
              </B1>
            </div>

            {/** 이미지 추가 필요 */}
            <div className="h-9 w-9 bg-amber-100">임시</div>
          </div>
        </div>

        <div className="pb-[calc(env(safe-area-inset-bottom)+24px)]">
          <Button variant="white" size="full" onClick={() => setIsShareSheetOpen(true)}>
            주인공에게 입장 링크 보내기
          </Button>
        </div>
      </div>

      <LinkShareSheet
        isOpen={isShareSheetOpen}
        link={shareLink}
        title="입장 링크 보내기"
        shareText="친구들이 파티방에서 애타게 기다리고 있어요. 얼른 와서 축하 파티를 시작해 주세요!"
        onClose={() => setIsShareSheetOpen(false)}
      />
    </>
  );
}
