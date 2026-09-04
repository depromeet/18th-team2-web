import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import toppingCandle from '@/assets/images/rolling-paper/topping-candle.png';
import toppingCherry from '@/assets/images/rolling-paper/topping-cherry.png';
import toppingStrawberry from '@/assets/images/rolling-paper/topping-strawberry.png';
import { Button } from '@/components/ui/Button';
import { B2, H2 } from '@/components/ui/Typography';
import { STAMP_SRC, getStampForId } from '@/utils/stamp';

interface RollingPaperArchiveNoticeSheetProps {
  isOpen: boolean;
  partyId: string;
  partyName: string;
  date?: string;
  onClose: () => void;
}

export function RollingPaperArchiveNoticeSheet({
  isOpen,
  partyId,
  partyName,
  date,
  onClose,
}: RollingPaperArchiveNoticeSheetProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const stamp = getStampForId(partyId);

  return createPortal(
    <div className="fixed inset-y-0 left-0 z-[120] w-screen overflow-hidden">
      <button
        type="button"
        aria-label="안내 닫기"
        className="absolute inset-0 cursor-default bg-black/70"
        onClick={onClose}
      />

      <div className="absolute right-0 bottom-[calc(10px+env(safe-area-inset-bottom))] left-0 mx-auto w-[calc(100vw-20px)] max-w-[355px]">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="rolling-paper-archive-notice-title"
          className="rolling-paper-archive-sheet flex w-full flex-col rounded-2xl bg-white"
        >
          <div className="px-5 pt-5 pb-2.5">
            <H2
              id="rolling-paper-archive-notice-title"
              className="leading-7 font-semibold tracking-[-0.002px] text-black"
            >
              롤링페이퍼는 <span className="text-blue-500">보관함</span>에서
              <br />
              언제든 다시 볼 수 있어요
            </H2>
          </div>

          <div className="px-5 py-2.5">
            <div className="rolling-paper-archive-flip h-[clamp(136px,42vw,165px)] w-full overflow-hidden rounded-[20px]">
              <div className="rolling-paper-archive-flip-inner relative h-full w-full">
                <div className="rolling-paper-archive-flip-face absolute inset-0 overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#3949FF_0%,#5C8BFD_50%,#8DA9FA_50.5%,#A8BDFC_100%)]">
                  <div className="absolute right-[-11%] bottom-[18%] left-[-11%] h-[52%] rounded-t-[50%] bg-[#8EAAFA]" />
                  <img
                    src={toppingCherry}
                    alt=""
                    className="absolute bottom-[18%] left-[8%] w-[22%] drop-shadow-[0_8px_14px_rgba(0,42,180,0.18)]"
                  />
                  <img
                    src={toppingStrawberry}
                    alt=""
                    className="absolute bottom-[34%] left-1/2 w-[21%] -translate-x-1/2 drop-shadow-[0_8px_14px_rgba(0,42,180,0.18)]"
                  />
                  <img
                    src={toppingCherry}
                    alt=""
                    className="absolute right-[19%] bottom-[12%] w-[22%] drop-shadow-[0_8px_14px_rgba(0,42,180,0.18)]"
                  />
                  <img
                    src={toppingCandle}
                    alt=""
                    className="absolute top-[18%] right-[10%] h-[46%] drop-shadow-[0_8px_14px_rgba(0,42,180,0.18)]"
                  />
                </div>

                <div className="rolling-paper-archive-flip-face rolling-paper-archive-flip-back absolute inset-0 overflow-hidden rounded-[20px] bg-[#CFCFFA]">
                  <img
                    src={STAMP_SRC[stamp]}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                    <B2 as="span" className="text-grey-900 max-w-[70%] truncate font-semibold">
                      {partyName}
                    </B2>
                    {date && <span className="text-caption-1 text-grey-600">{date}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 pt-4 pb-4">
            <Button variant="white-blue" size="full" onClick={onClose}>
              닫기
            </Button>
          </div>
        </section>
      </div>
    </div>,
    document.body,
  );
}
