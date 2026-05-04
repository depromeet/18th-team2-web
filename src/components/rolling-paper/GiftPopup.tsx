import giftImage from '@/assets/images/gift.png';
import { Button } from '@/components/ui/Button';
import { H3, B1 } from '@/components/ui/Typography';

interface GiftPopupProps {
  onConfirm: () => void;
  onClose: () => void;
}

export function GiftPopup({ onConfirm, onClose }: GiftPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Popup card */}
      <div className="relative flex w-[343px] flex-col items-center gap-8 rounded-[20px] bg-white px-0 pt-6 pb-4">
        <div className="flex flex-col items-center gap-3">
          <img src={giftImage} alt="선물" className="h-20 w-20" draggable={false} />
          <div className="flex flex-col items-center gap-3 px-3">
            <H3 className="text-grey-700 text-center">선물이 도착했어요!</H3>
            <B1 className="text-grey-500 text-center font-medium">
              친구들이 남긴 따뜻한 마음들이
              <br />
              모두 도착했어요. 지금 바로 열어볼까요?
            </B1>
          </div>
        </div>

        <div className="flex w-full justify-center px-3">
          <Button variant="primary" size="full" onClick={onConfirm}>
            롤링페이퍼 확인하러 가기
          </Button>
        </div>
      </div>
    </div>
  );
}
