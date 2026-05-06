import whiteGradientBig from '@/assets/images/white-gradient-big.png';
import { T3 } from '@/components/ui/Typography';

export function PartyEnterStage() {
  return (
    <div className="absolute inset-0 z-10">
      <img src={whiteGradientBig} className="absolute top-0 left-0 w-full" />
      <div className="flex h-full flex-col items-center justify-center">
        {/* TODO: 캐릭터 이미지 */}
        <div className="party-enter-character h-[188px] w-[160px] bg-sky-400" />

        <T3 className="mt-25 text-center text-white">
          오늘의 주인공
          <br />
          현진님이
          <br />
          등장했어요!
        </T3>
      </div>
    </div>
  );
}
