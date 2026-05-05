import candleImg from '@/assets/images/topping-candle.png';
import cherryImg from '@/assets/images/topping-cherry.png';
import strawberryImg from '@/assets/images/topping-strawberry.png';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { B1, B2, H1 } from '@/components/ui/Typography';
import type { ToppingType } from '@/services/rolling-paper';

const TOPPING_IMAGES: Record<ToppingType, string> = {
  cherry: cherryImg,
  strawberry: strawberryImg,
  candle: candleImg,
};

const TOPPING_LABELS: Record<ToppingType, string> = {
  cherry: '체리',
  strawberry: '딸기',
  candle: '캔들',
};

interface RollingPaperWriteCompleteProps {
  hostName: string;
  nickname: string;
  message: string;
  toppingType: ToppingType;
  onBack: () => void;
  onComplete: () => void;
}

export function RollingPaperWriteComplete({
  hostName,
  nickname,
  message,
  toppingType,
  onBack,
  onComplete,
}: RollingPaperWriteCompleteProps) {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-bg">
      <PageHeader variant="back" onBack={onBack} />

      <section className="flex flex-1 flex-col gap-2 px-4 pt-5">
        {/* 타이틀 */}
        <div className="flex flex-col gap-2">
          <H1 as="h1" className="text-black">
            {hostName}님에게
            <br />
            롤링페이퍼를 잘 전달해드릴게요
          </H1>
          <B1 className="font-medium text-grey-500">메세지는 파티 종료 후 생일자에게 전달돼요.</B1>
        </div>

        {/* 메시지 카드 */}
        <div className="mt-2">
          <div
            className="flex flex-col gap-3 rounded-[20px] bg-white px-6 py-6"
            style={{ boxShadow: '0px 0px 8px 0px #5892FF4D' }}
          >
            <img
              src={TOPPING_IMAGES[toppingType]}
              alt={TOPPING_LABELS[toppingType]}
              className="h-10 w-10 object-contain"
            />
            <p className="text-[20px] font-semibold leading-[1.4] tracking-tight text-blue-600 whitespace-pre-wrap wrap-break-word">
              {message}
            </p>
            <B1 as="p" className="font-semibold text-grey-800">
              - {nickname}
            </B1>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-150 flex-col items-center gap-2 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_30%)] px-4 pb-6 pt-8">
        <B2 as="p" className="font-medium text-grey-500">
          완료를 누르면 수정이 불가합니다.
        </B2>
        <Button variant="primary" size="full" onClick={onComplete}>
          작성 완료
        </Button>
      </div>
    </main>
  );
}
