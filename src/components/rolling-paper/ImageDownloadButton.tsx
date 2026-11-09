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

interface CaptureSession {
  target: HTMLElement;
  id: string;
}

// 인스턴스가 여러 개여도 마커 값이 겹치지 않도록 모듈 단위로 증가시킨다
let captureSequence = 0;

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
  const isMountedRef = useRef(true);
  const activeCaptureRef = useRef<CaptureSession | null>(null);

  // 이 캡쳐가 단 마커일 때만 제거해 다른 캡쳐의 마커를 건드리지 않는다
  const releaseCaptureMarker = useCallback((capture: CaptureSession) => {
    if (capture.target.dataset.capturing === capture.id) {
      delete capture.target.dataset.capturing;
    }
    if (activeCaptureRef.current === capture) activeCaptureRef.current = null;
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
      // 캡쳐 도중 버튼이 사라지면(예: 작성 시간 만료) 숨겨둔 헤더 등이 계속 안 보이지 않도록 바로 복구한다
      if (activeCaptureRef.current) releaseCaptureMarker(activeCaptureRef.current);
    };
  }, [releaseCaptureMarker]);

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

    captureSequence += 1;
    const capture: CaptureSession = { target, id: String(captureSequence) };

    setIsCapturing(true);
    // data-capture-hidden 요소를 숨기는 동안 화면이 깜빡이지 않도록 먼저 가린다
    setFlashPhase('cover');
    try {
      await waitForPaint();
      if (!isMountedRef.current) return;

      target.dataset.capturing = capture.id;
      activeCaptureRef.current = capture;
      const dataUrl = await toPng(target, {
        pixelRatio,
        cacheBust: true,
      });
      releaseCaptureMarker(capture);
      if (!isMountedRef.current) return;

      // 셔터처럼 화면이 번쩍인 뒤 캡쳐 이미지를 띄운다
      // 셔터 효과가 끝날 때까지 캡쳐 중으로 두어 그 사이 버튼이 다시 눌리지 않게 한다
      setFlashPhase('fade');
      flashTimerRef.current = window.setTimeout(() => {
        setFlashPhase(null);
        setCapturedImageUrl(dataUrl);
        setIsCapturing(false);
      }, CAPTURE_FLASH_DURATION_MS);
    } catch {
      if (!isMountedRef.current) return;
      setFlashPhase(null);
      setIsCapturing(false);
      setToast({ id: Date.now(), type: 'error', message: '이미지 캡쳐에 실패했어요' });
    } finally {
      releaseCaptureMarker(capture);
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
