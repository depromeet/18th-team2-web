import { useNavigate } from 'react-router-dom';

import { CakeBackground } from '@/components/rolling-paper/CakeBackground';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { HomeIcon } from '@/components/ui/icons/HomeIcon';
import { B1, H1 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';

/**
 * 롤페만 작성(PAPER_ONLY) 파티에서 공개 시간(밤 10시) 전 조회 시 노출.
 * 에러 화면 대신 롤링페이퍼 화면의 비주얼을 그대로 재사용한 잠금 상태.
 */
export function RollingPaperLockedView() {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-dvh overflow-hidden"
      style={{
        background: 'linear-gradient(179.96deg, #3342F3 0.03%, #5C8BFD 46.18%)',
        ['--rolling-paper-art-offset' as string]: 'clamp(-81px, calc(100dvh - 812px), 0px)',
      }}
    >
      <CakeBackground />

      <div className="relative z-20 px-4 pt-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="-ml-2 flex h-12 w-12 items-center justify-center"
          >
            <ChevronLeftIcon className="text-white" />
          </button>

          <button
            type="button"
            aria-label="메인으로"
            onClick={() => navigate(ROUTES.home)}
            className="flex h-12 w-12 items-center justify-center"
          >
            <HomeIcon />
          </button>
        </div>

        <H1 className="mt-5 font-semibold tracking-[-0.0002em] text-white">
          받은 롤링페이퍼는
          <br />
          밤 10시에 공개돼요
        </H1>
        <B1 className="mt-2 text-blue-100">
          공개 시간이 되면
          <br />
          받은 롤링페이퍼를 확인할 수 있어요.
        </B1>
      </div>
    </div>
  );
}
