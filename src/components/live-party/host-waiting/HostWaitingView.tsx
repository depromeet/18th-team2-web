import { useState } from 'react';

import characterBlueHostSrc from '@/assets/images/character/character-blue-host.png';
import cakeSrc from '@/assets/images/live-party/cake.svg';
import partyLightSrc from '@/assets/images/live-party/party-light.png';
import { PartyDeleteDialog } from '@/components/party-invitation/PartyDeleteDialog';
import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { B2, H2 } from '@/components/ui/Typography';
import { config } from '@/config/env';
import type { PartyParticipantResult } from '@/services/live-party';

interface HostWaitingViewProps {
  celebrant?: PartyParticipantResult;
  remainingSeconds?: number;
  isEnding: boolean;
  isDeleting?: boolean;
  onInvite: () => void;
  onDelete: () => void;
  onClose: () => void;
}

function resolveImageUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${config.apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export function HostWaitingView({
  celebrant,
  remainingSeconds = 60,
  isEnding,
  isDeleting = false,
  onInvite,
  onDelete,
  onClose,
}: HostWaitingViewProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const characterImage = resolveImageUrl(celebrant?.characterImageUrl) ?? characterBlueHostSrc;

  return (
    <>
      <main className="bg-blue-1000 relative h-svh w-full overflow-hidden text-white">
        <img
          src={partyLightSrc}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <button
          type="button"
          aria-label="닫기"
          className="absolute top-[9px] right-4 z-10 flex h-6 w-6 items-center justify-center"
          onClick={onClose}
        >
          <CloseIcon className="text-white" />
        </button>

        <section className="relative z-1 flex h-full flex-col items-center px-4 pt-[190px] pb-8">
          <div className="relative h-[220px] w-[260px]">
            <img
              src={cakeSrc}
              alt=""
              aria-hidden
              className="absolute top-0 left-1/2 h-40 w-60 -translate-x-1/2"
            />
            <img
              src={characterImage}
              alt={celebrant?.nickname ?? '주인공 캐릭터'}
              className="party-enter-character absolute top-[92px] left-1/2 h-[125px] w-[125px] -translate-x-1/2 object-contain"
              draggable={false}
            />
          </div>

          <div className="mt-[82px] flex w-full flex-col items-center gap-4 text-center">
            {isEnding ? (
              <>
                <H2 className="font-bold text-white">
                  참가자가 아무도 없어서
                  <br />
                  파티가 <span className="text-red-400">{remainingSeconds}초</span> 후 없어질
                  예정이에요
                </H2>
                <B2 className="text-white/60">파티는 없어져도 롤링페이퍼는 계속 받을 수 있어요</B2>
              </>
            ) : (
              <H2 className="font-bold text-white">
                아직 참가자가 없어요
                <br />
                친구를 초대해 볼까요?
              </H2>
            )}
          </div>

          <div className="mt-auto flex w-full flex-col items-center gap-2">
            <Button type="button" onClick={onInvite}>
              초대하기
            </Button>
            <Button type="button" variant="link-white" onClick={() => setIsDeleteDialogOpen(true)}>
              파티삭제하기
            </Button>
          </div>
        </section>
      </main>

      <PartyDeleteDialog
        isOpen={isDeleteDialogOpen}
        isPending={isDeleting}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={onDelete}
      />
    </>
  );
}
