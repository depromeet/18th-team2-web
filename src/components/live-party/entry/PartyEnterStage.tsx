import DefaultHost from '@/assets/images/live-party/default-host.svg?react';
import whiteGradientBig from '@/assets/images/live-party/white-gradient-big.png';
import { T3 } from '@/components/ui/Typography';

export function PartyEnterStage() {
  return (
    <div className="absolute inset-0 z-10">
      <img src={whiteGradientBig} className="absolute top-0 left-0 w-full" />
      {/* 주최자 - 프리런칭을 위한 하드코딩 */}
      <DefaultHost className="party-enter-character absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <T3 className="absolute right-0 bottom-32 left-0 text-center text-white">
        오늘의 주인공
        <br />
        현진님이
        <br />
        등장했어요!
      </T3>
    </div>
  );
}
