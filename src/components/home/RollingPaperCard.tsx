import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import rollingPaper from '@/assets/images/home/rolling-paper.png';
import { Badge } from '../ui/Badge';
import { H3 } from '../ui/Typography';

export function RollingPaperCard() {
  return (
    <Link
      to={ROUTES.createRollingPaperSetup}
      className="relative block h-47.5 w-full min-w-85.75 cursor-pointer overflow-hidden rounded-2xl border border-blue-50 bg-linear-to-br from-[#D3E1FF] to-white pt-6 pl-5"
    >
      <img
        src={rollingPaper}
        alt="롤링페이퍼"
        draggable={false}
        aria-hidden
        className="absolute top-0 right-0 h-full w-auto mask-b-from-80%"
      />
      <div className="relative flex flex-col gap-3">
        <H3 className="text-blue-800">
          롤링페이퍼로 <br />
          기념하기
        </H3>
        <div className="flex gap-1">
          <Badge theme="white">나만보기</Badge>
          <Badge theme="white">7일 후 공개</Badge>
        </div>
      </div>
    </Link>
  );
}
