import hapalinPartyCard from '@/assets/images/hapalin-party-card.png';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { H1 } from '@/components/ui/Typography';

export default function PartyCreateIntroPage() {
  return (
    <MobileLayout>
      <div
        className="relative flex w-full flex-1 flex-col items-center self-stretch overflow-hidden pt-[20vh]"
        style={{
          background: 'linear-gradient(180deg, #E8F0FF 0%, #0054FF 70%)',
        }}
      >
        <H1 className="party-intro-text relative z-10 text-center tracking-[-0.02em] text-white">
          파티 만들기를 시작할게요!
        </H1>
        <div className="relative z-10 mt-[4vh] w-full">
          <img
            src={hapalinPartyCard}
            alt="파티 케이크"
            className="party-intro-card w-full select-none"
            draggable={false}
          />
        </div>
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-[50%]"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 25%), radial-gradient(100% 100% at 50% 0%, rgba(64, 93, 243, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)',
          }}
        />
      </div>
    </MobileLayout>
  );
}
