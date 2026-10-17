import { Badge } from '../ui/Badge';
import { H3 } from '../ui/Typography';
import liveParty from '@/assets/images/home/live-party.png';

export function LivePartyCard() {
  return (
    <div className="relative flex h-47.5 w-full min-w-85.75 overflow-hidden rounded-2xl border border-blue-300 bg-linear-to-br from-[#1744f4] to-[#afd1ff] pt-6 pl-5">
      <img
        src={liveParty}
        alt="라이브파티"
        aria-hidden
        draggable={false}
        className="absolute top-0 right-0 h-full w-auto mask-b-from-75%"
      />
      <div className="relative flex flex-col gap-3">
        <H3 className="text-white">
          온라인 생일파티로 <br />
          기념하기
        </H3>
        <Badge>채팅 + 게임 + 롤링페이퍼</Badge>
      </div>
    </div>
  );
}
