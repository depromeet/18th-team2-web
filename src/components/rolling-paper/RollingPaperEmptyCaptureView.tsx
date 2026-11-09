import type { RefObject } from 'react';

import letterImage from '@/assets/images/live-party/letter.png';
import { B1, H1 } from '@/components/ui/Typography';

interface RollingPaperEmptyCaptureViewProps {
  hostName?: string;
  /** 캡쳐 대상 프레임 */
  captureRef: RefObject<HTMLDivElement>;
}

/**
 * 받은 편지가 없을 때 이미지 저장용 레이아웃
 * 화면 UI(헤더·하단 버튼)를 빼고 기기 크기와 무관하게 9:16 고정 비율로 찍기 위해 화면 밖에 렌더링
 */
export function RollingPaperEmptyCaptureView({
  hostName,
  captureRef,
}: RollingPaperEmptyCaptureViewProps) {
  return (
    <div aria-hidden className="pointer-events-none fixed top-0 -left-2500">
      <div
        ref={captureRef}
        className="bg-rolling-paper-main flex h-160 w-90 flex-col px-6 pt-20 pb-16"
      >
        <H1 className="font-semibold tracking-normal text-white">
          {hostName ? `${hostName}님을 위해` : '나를 위해'}
          <br />
          롤링페이퍼를 작성해 주세요!
        </H1>
        <B1 className="mt-2 font-medium text-blue-100">가장 처음으로 마음을 남겨보세요</B1>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <img
            src={letterImage}
            alt=""
            className="drop-shadow-rolling-paper-empty w-62.5 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
