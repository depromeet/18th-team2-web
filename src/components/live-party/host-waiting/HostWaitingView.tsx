import characterBlueHostSrc from '@/assets/images/character/character-blue-host.png';
import cakeSrc from '@/assets/images/live-party/cake.svg';
import partyLightSrc from '@/assets/images/live-party/party-light.png';
import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { B2, H2 } from '@/components/ui/Typography';
import { config } from '@/config/env';
import type { PartyParticipantResult } from '@/services/live-party';

interface HostWaitingViewProps {
  celebrant?: PartyParticipantResult;
  remainingSeconds?: number;
  isEnding: boolean;
  onInvite: () => void;
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
  onInvite,
  onClose,
}: HostWaitingViewProps) {
  const characterImage = resolveImageUrl(celebrant?.characterImageUrl) ?? characterBlueHostSrc;

  return (
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
        className="absolute top-2.25 right-4 z-10 flex h-6 w-6 items-center justify-center"
        onClick={onClose}
      >
        <CloseIcon className="text-white" />
      </button>

      <section className="relative z-1 flex h-full flex-col items-center px-4 pt-47.5 pb-[calc(32px+env(safe-area-inset-bottom))] [@media_(max-height:700px)]:pt-27.5 [@media_(max-height:700px)]:pb-[calc(20px+env(safe-area-inset-bottom))]">
        <div className="relative h-55 w-65 [@media_(max-height:700px)]:h-47.5 [@media_(max-height:700px)]:w-60">
          <img
            src={cakeSrc}
            alt=""
            aria-hidden
            className="absolute top-0 left-1/2 h-40 w-60 -translate-x-1/2 [@media_(max-height:700px)]:h-36 [@media_(max-height:700px)]:w-54"
          />
          <img
            src={characterImage}
            alt={celebrant?.nickname ?? '주인공 캐릭터'}
            className="party-enter-character absolute top-23 left-1/2 h-31.25 w-31.25 -translate-x-1/2 object-contain [@media_(max-height:700px)]:top-20.5 [@media_(max-height:700px)]:h-28 [@media_(max-height:700px)]:w-28"
            draggable={false}
          />
        </div>

        <div className="mt-20.5 flex w-full flex-col items-center gap-4 text-center [@media_(max-height:700px)]:mt-10 [@media_(max-height:700px)]:gap-3">
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

        {/* 시작한 파티는 삭제할 수 없어 삭제 진입점을 노출하지 않는다. */}
        <div className="mt-auto flex w-full flex-col items-center gap-2">
          <Button type="button" onClick={onInvite}>
            초대하기
          </Button>
        </div>
      </section>
    </main>
  );
}
