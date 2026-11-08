import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { toPng } from 'html-to-image';

import DownloadIcon from '@/assets/images/icons/download.svg?react';
import { CapturedImagePreview } from '@/components/rolling-paper/CapturedImagePreview';
import { Toast, type ToastState } from '@/components/ui/Toast';
import { isInAppBrowser } from '@/utils/browser';

const CAPTURE_FLASH_DURATION_MS = 350;
const DEFAULT_CAPTURE_PIXEL_RATIO = 2;

interface ImageDownloadButtonProps {
  /** 캡쳐할 화면 영역 */
  targetRef: RefObject<HTMLElement>;
  fileName?: string;
  pixelRatio?: number;
}

function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function waitForPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export function ImageDownloadButton({
  targetRef,
  fileName = 'rolling-paper.png',
  pixelRatio = DEFAULT_CAPTURE_PIXEL_RATIO,
}: ImageDownloadButtonProps) {
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  // cover: 캡쳐 중 화면을 가리는 단계, fade: 캡쳐 후 셔터처럼 사라지는 단계
  const [flashPhase, setFlashPhase] = useState<'cover' | 'fade' | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  const closeToast = useCallback(() => setToast(null), []);
  const closePreview = useCallback(() => setCapturedImageUrl(null), []);

  const handleSave = () => {
    if (!capturedImageUrl) return;
    downloadDataUrl(capturedImageUrl, fileName);
    setToast({ id: Date.now(), type: 'success', message: '이미지를 저장했어요' });
  };

  const handleCapture = async () => {
    const target = targetRef.current;
    if (!target || isCapturing) return;

    setIsCapturing(true);
    // data-capture-hidden 요소를 숨기는 동안 화면이 깜빡이지 않도록 먼저 가린다
    setFlashPhase('cover');
    try {
      await waitForPaint();
      target.dataset.capturing = 'true';
      const dataUrl = await toPng(target, {
        pixelRatio,
        cacheBust: true,
      });
      delete target.dataset.capturing;

      // 셔터처럼 화면이 번쩍인 뒤 캡쳐 이미지를 띄운다
      // 셔터 효과가 끝날 때까지 캡쳐 중으로 두어 그 사이 버튼이 다시 눌리지 않게 한다
      setFlashPhase('fade');
      flashTimerRef.current = window.setTimeout(() => {
        setFlashPhase(null);
        setCapturedImageUrl(dataUrl);
        setIsCapturing(false);
      }, CAPTURE_FLASH_DURATION_MS);
    } catch {
      delete target.dataset.capturing;
      setFlashPhase(null);
      setIsCapturing(false);
      setToast({ id: Date.now(), type: 'error', message: '이미지 캡쳐에 실패했어요' });
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="이미지 저장하기"
        title="이미지 저장하기"
        disabled={isCapturing}
        onClick={handleCapture}
        className="border-grey-200 text-grey-900 rounded-btn-lg flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center border bg-white"
      >
        <DownloadIcon className="h-6 w-6" />
      </button>

      {flashPhase &&
        createPortal(
          <div
            aria-hidden
            className={`pointer-events-none fixed inset-0 z-90 bg-white ${
              flashPhase === 'fade' ? 'capture-flash' : ''
            }`}
          />,
          document.body,
        )}

      {capturedImageUrl && (
        <CapturedImagePreview
          imageUrl={capturedImageUrl}
          // 인앱 브라우저는 다운로드가 막혀도 알 수 없어 저장 버튼 없이 길게 눌러 저장하도록 안내한다
          onSave={isInAppBrowser() ? undefined : handleSave}
          onClose={closePreview}
        />
      )}

      <Toast toast={toast} onClose={closeToast} />
    </>
  );
}
