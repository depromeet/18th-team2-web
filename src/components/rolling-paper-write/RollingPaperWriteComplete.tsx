import candleImg from '@/assets/images/topping-candle.png';
import cherryImg from '@/assets/images/topping-cherry.png';
import strawberryImg from '@/assets/images/topping-strawberry.png';
import { Button } from '@/components/ui/Button';
import { B1, H1, H2 } from '@/components/ui/Typography';
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
  nickname: string;
  message: string;
  toppingType: ToppingType;
  onComplete: () => void;
}

export function RollingPaperWriteComplete({ nickname, message, toppingType, onComplete }: RollingPaperWriteCompleteProps) {
  return (
    <main className="bg-gradient-bg flex min-h-screen flex-col">
      <section className="flex flex-1 flex-col items-center gap-8 px-4 pt-16">
        <H1 as="h1" className="text-center tracking-[-0.0002em] text-black">
          롤링페이퍼가
          <br />
          완성되었어요!
        </H1>

        <article
          className="flex w-full flex-col items-center gap-6 rounded-2xl bg-white px-7.5 py-9"
          style={{ boxShadow: '0px 0px 8px 0px #5892FF4D' }}
        >
          <img
            src={TOPPING_IMAGES[toppingType]}
            alt={TOPPING_LABELS[toppingType]}
            className="h-24 w-24 object-contain"
          />

          <hr className="w-full border-blue-50" />

          <H2 as="p" className="w-full whitespace-pre-wrap wrap-break-word text-left font-semibold text-blue-600">
            {message}
          </H2>

          <hr className="w-full border-blue-50" />

          <B1 as="p" className="w-full text-right font-semibold text-grey-700">
            — {nickname}
          </B1>
        </article>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto flex h-27.5 w-full max-w-150 items-end bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_40.91%)] px-4 pb-6">
        <Button variant="primary" size="full" onClick={onComplete}>
          작성 완료
        </Button>
      </div>
    </main>
  );
}
