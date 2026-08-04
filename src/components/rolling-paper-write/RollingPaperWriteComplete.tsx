import candleImg from '@/assets/images/rolling-paper/topping-candle.png';
import cherryImg from '@/assets/images/rolling-paper/topping-cherry.png';
import strawberryImg from '@/assets/images/rolling-paper/topping-strawberry.png';
import { RollingPaperFormHeading } from '@/components/rolling-paper-write/RollingPaperFormHeading';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { B1, B2 } from '@/components/ui/Typography';
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
    <main className="bg-gradient-bg flex min-h-screen flex-col">
      <PageHeader onBack={onBack} />

      <section className="flex flex-1 flex-col px-4">
        <RollingPaperFormHeading
          title={
            <>
              {hostName}님에게
              <br />
              롤링페이퍼를 잘 전달해드릴게요
            </>
          }
          description="메세지는 파티 종료 후 생일자에게 전달돼요."
          className="py-5"
        />

        <div className="flex flex-col items-center gap-2 py-2">
          <img
            src={TOPPING_IMAGES[toppingType]}
            alt={TOPPING_LABELS[toppingType]}
            className="h-10 w-10 object-contain"
          />
          <div className="flex min-h-[252px] w-full flex-col gap-3 rounded-[20px] bg-white px-6 py-6">
            <p className="flex-1 text-[20px] leading-[1.4] font-semibold tracking-tight wrap-break-word whitespace-pre-wrap text-blue-600">
              {message}
            </p>
            <B1 as="p" className="text-grey-700 text-right font-semibold">
              - {nickname}
            </B1>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-150 flex-col items-center gap-2 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_30%)] px-4 pt-8 pb-[calc(24px+env(safe-area-inset-bottom))]">
        <B2 as="p" className="text-grey-500 font-medium">
          완료를 누르면 수정이 불가합니다.
        </B2>
        <Button variant="primary" size="full" onClick={onComplete}>
          작성 완료
        </Button>
      </div>
    </main>
  );
}
