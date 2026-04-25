import hapalinPartyCard from '@/assets/images/hapalin-party-card.png';
import { B1, L1 } from '@/components/ui/Typography';

export function PartyCard() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <img src={hapalinPartyCard} alt="파티 카드" className="w-full" />
      <div className="absolute top-5 left-5">
        <div
          className="pointer-events-none absolute inset-0 rounded-[40px]"
          style={{
            padding: '1px',
            background:
              'linear-gradient(109.99deg, rgba(255, 255, 255, 0.8) 12.15%, rgba(255, 255, 255, 0.23) 99.79%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'destination-out',
            maskComposite: 'exclude',
          }}
        />
        <button className="flex h-9 w-24.5 items-center justify-center gap-2.5 rounded-[40px] bg-white/20 px-3 py-1.5 text-white">
        <B1 as="span" className="font-medium">
          파티 만들기
        </B1>
        </button>
      </div>
      <div className="absolute bottom-5 left-5 flex flex-col gap-0.5 text-blue-50">
        <L1>짧게 함께 축하할 수 있는 온라인 파티를 열어보세요.</L1>
        <L1>초대장을 만들고 친구들을 초대해요.</L1>
      </div>
    </div>
  );
}
