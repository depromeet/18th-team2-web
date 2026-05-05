import { useEffect, useRef, useState, type MouseEvent } from 'react';

import linkIcon from '@/assets/icons/icon-line.svg';
import { B1, B2, H2, L1 } from '@/components/ui/Typography';
import { SHARE_ENDPOINTS } from '@/constants/external-urls';

const TOAST_VISIBLE_MS = 1600;
const TOAST_EXIT_MS = 300;

interface LinkShareSheetProps {
  isOpen: boolean;
  link: string;
  title: string;
  onClose: () => void;
  shareText?: string;
  copySuccessMessage?: string;
}

// TODO: 브랜드 SVG 아이콘으로 mark 교체, 카카오 SDK 연동 추가
const SHARE_SERVICES = [
  { id: 'kakao', label: '카카오톡', mark: 'K' },
  { id: 'x', label: 'X', mark: 'X' },
  { id: 'naver', label: '네이버', mark: 'N' },
  { id: 'facebook', label: '페이스북', mark: 'f' },
  { id: 'line', label: '라인', mark: 'L' },
] as const;

type ShareServiceId = (typeof SHARE_SERVICES)[number]['id'];

function getShareUrl(serviceId: ShareServiceId, link: string, shareText: string) {
  const encodedUrl = encodeURIComponent(link);
  const encodedTitle = encodeURIComponent(shareText);

  if (serviceId === 'kakao') {
    // TODO: Kakao JavaScript SDK 연결 후 카카오톡 공유창 열기
    return null;
  }

  if (serviceId === 'x') {
    return SHARE_ENDPOINTS.x(encodedUrl, encodedTitle);
  }

  if (serviceId === 'naver') {
    return SHARE_ENDPOINTS.naver(encodedUrl, encodedTitle);
  }

  if (serviceId === 'facebook') {
    return SHARE_ENDPOINTS.facebook(encodedUrl);
  }

  if (serviceId === 'line') {
    return SHARE_ENDPOINTS.line(encodedUrl);
  }

  return null;
}

export function LinkShareSheet({
  isOpen,
  link,
  title,
  onClose,
  shareText = '링크가 도착했어요',
  copySuccessMessage = '링크가 복사되었어요',
}: LinkShareSheetProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const toastExitTimerRef = useRef<number | null>(null);
  const mouseDragRef = useRef({
    isDown: false,
    didDrag: false,
    startX: 0,
    scrollLeft: 0,
  });
  const [isCopyToastVisible, setIsCopyToastVisible] = useState(false);
  const [isCopyToastExiting, setIsCopyToastExiting] = useState(false);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      if (toastExitTimerRef.current) {
        window.clearTimeout(toastExitTimerRef.current);
      }
    };
  }, []);

  const showCopyToast = () => {
    setIsCopyToastVisible(true);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    if (toastExitTimerRef.current) {
      window.clearTimeout(toastExitTimerRef.current);
    }

    setIsCopyToastExiting(false);
    toastTimerRef.current = window.setTimeout(() => {
      setIsCopyToastExiting(true);

      toastExitTimerRef.current = window.setTimeout(() => {
        setIsCopyToastVisible(false);
        setIsCopyToastExiting(false);
      }, TOAST_EXIT_MS);
    }, TOAST_VISIBLE_MS);
  };

  const handleCopyLink = async () => {
    // TODO: API 응답의 실제 공유 링크로 교체
    try {
      await navigator.clipboard.writeText(link);
      onClose();
      showCopyToast();
    } catch {
      onClose();
    }
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !scrollRef.current) return;

    mouseDragRef.current = {
      isDown: true,
      didDrag: false,
      startX: event.clientX,
      scrollLeft: scrollRef.current.scrollLeft,
    };
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const scrollElement = scrollRef.current;
    if (!mouseDragRef.current.isDown || !scrollElement) return;

    const distance = event.clientX - mouseDragRef.current.startX;
    if (Math.abs(distance) > 5) {
      mouseDragRef.current.didDrag = true;
      event.preventDefault();
    }

    scrollElement.scrollLeft = mouseDragRef.current.scrollLeft - distance;
  };

  const handleMouseUp = () => {
    mouseDragRef.current.isDown = false;
  };

  const handleShareClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!mouseDragRef.current.didDrag) return;

    event.preventDefault();
    event.stopPropagation();
    window.setTimeout(() => {
      mouseDragRef.current.didDrag = false;
    }, 0);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
        }`}
      >
        <button
          type="button"
          aria-label="공유창 닫기"
          className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
        />
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="link-share-title"
          className={`absolute bottom-8 left-1/2 flex h-[282px] w-[355px] max-w-[calc(100%-20px)] -translate-x-1/2 flex-col gap-1 rounded-[16px] bg-white px-5 pt-3 pb-4 transition-transform duration-300 ease-out ${
            isOpen ? 'translate-y-0' : 'translate-y-[calc(100%+32px)]'
          }`}
        >
          <div className="bg-grey-100 mx-auto h-1 w-10 rounded-full" />
          <div className="mt-4 flex items-center justify-between">
            <H2 id="link-share-title" className="text-grey-900">
              {title}
            </H2>
            <button
              type="button"
              aria-label="공유창 닫기"
              className="text-grey-400 flex h-10 w-10 items-center justify-center"
              onClick={onClose}
            >
              <CloseIcon />
            </button>
          </div>

          <button
            type="button"
            className="mt-3 flex h-10 w-full items-center gap-3 text-left"
            onClick={handleCopyLink}
          >
            <img src={linkIcon} alt="" className="h-6 w-6" />
            <B1 as="span" className="text-grey-600 font-medium">
              링크 복사하기
            </B1>
          </button>

          <div className="border-grey-50 mt-3 border-t" />

          <div
            ref={scrollRef}
            className="share-scroll-hide mt-6 flex h-[90px] cursor-grab touch-pan-x items-start gap-5 overflow-x-auto overflow-y-hidden select-none active:cursor-grabbing"
            onClickCapture={handleShareClickCapture}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {SHARE_SERVICES.map((service) => {
              const shareUrl = getShareUrl(service.id, link, shareText);
              const content = (
                <>
                  <span className="bg-grey-100 text-head-2 text-grey-500 flex h-15 w-15 shrink-0 items-center justify-center rounded-[16px] font-bold">
                    {service.mark}
                  </span>
                  <L1 className="text-grey-500">{service.label}</L1>
                </>
              );

              if (!shareUrl) {
                return (
                  <button
                    key={service.id}
                    type="button"
                    className="flex w-15 shrink-0 flex-col items-center gap-2"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <a
                  key={service.id}
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-15 shrink-0 flex-col items-center gap-2"
                >
                  {content}
                </a>
              );
            })}
          </div>
        </section>
      </div>

      {isCopyToastVisible && (
        <div className="pointer-events-none absolute right-0 bottom-10 left-0 z-50 flex justify-center">
          <div
            className={`link-share-toast flex h-[54px] w-[343px] max-w-[calc(100%-32px)] items-center justify-center gap-2 rounded-[8px] bg-black/70 px-4 py-4 text-white ${
              isCopyToastExiting ? 'link-share-toast-exit' : ''
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
              <ToastCheckIcon />
            </span>
            <B2 as="span" className="text-grey-100 font-semibold">
              {copySuccessMessage}
            </B2>
          </div>
        </div>
      )}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ToastCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3.5 7.1L5.8 9.4L10.5 4.6"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
