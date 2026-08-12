import { useEffect, useRef, useState, type MouseEvent } from 'react';

import linkIcon from '@/assets/icons/icon-line.svg';
import facebookIcon from '@/assets/images/sns-logo/facebook.png';
import kakaoIcon from '@/assets/images/sns-logo/kakao.png';
import lineIcon from '@/assets/images/sns-logo/line.png';
import naverIcon from '@/assets/images/sns-logo/naver.png';
import xIcon from '@/assets/images/sns-logo/x.png';
import { CheckIcon } from '@/components/ui/icons/CheckIcon';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { B1, B2, H2, L1 } from '@/components/ui/Typography';
import { SHARE_ENDPOINTS } from '@/constants/external-urls';
import { shareToKakao } from '@/utils/kakao';

const TOAST_VISIBLE_MS = 1600;
const TOAST_EXIT_MS = 300;

interface LinkShareSheetProps {
  isOpen: boolean;
  link: string;
  title: string;
  onClose: () => void;
  shareText?: string;
  shareDescription?: string;
  copySuccessMessage?: string;
}

const SHARE_SERVICES = [
  { id: 'kakao', label: '카카오톡', icon: kakaoIcon },
  { id: 'x', label: 'X', icon: xIcon },
  { id: 'naver', label: '네이버', icon: naverIcon },
  { id: 'facebook', label: '페이스북', icon: facebookIcon },
  { id: 'line', label: '라인', icon: lineIcon },
] as const;

type ShareServiceId = (typeof SHARE_SERVICES)[number]['id'];

function getShareUrl(serviceId: ShareServiceId, link: string, shareText: string) {
  const encodedUrl = encodeURIComponent(link);
  const encodedTitle = encodeURIComponent(shareText);

  if (serviceId === 'kakao') {
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
  shareDescription,
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

  const handleShareServiceClick = async (serviceId: ShareServiceId) => {
    if (serviceId !== 'kakao') return;

    try {
      const shared = await shareToKakao(link, shareText, shareDescription);
      if (shared) {
        onClose();
        return;
      }
    } catch {
      // SDK 설정 또는 브라우저 환경 문제 시 링크 복사로 대체
    }

    await handleCopyLink();
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
    <div className="pointer-events-none fixed inset-y-0 left-1/2 z-50 w-full max-w-150 -translate-x-1/2">
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
          className={`absolute bottom-[calc(32px+env(safe-area-inset-bottom))] left-1/2 flex h-[282px] w-[calc(100%-24px)] -translate-x-1/2 flex-col gap-1 rounded-2xl bg-white px-5 pt-3 pb-4 transition-transform duration-300 ease-out ${
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
            className="share-scroll-hide -mx-5 mt-6 flex h-[90px] cursor-grab touch-pan-x items-start gap-5 overflow-x-auto overflow-y-hidden px-5 select-none active:cursor-grabbing"
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
                  <img
                    src={service.icon}
                    alt=""
                    className="h-15 w-15 shrink-0 rounded-2xl object-cover"
                    draggable={false}
                  />
                  <L1 className="text-grey-500">{service.label}</L1>
                </>
              );

              if (!shareUrl) {
                return (
                  <button
                    key={service.id}
                    type="button"
                    className="flex w-15 shrink-0 cursor-pointer flex-col items-center gap-2"
                    onClick={() => handleShareServiceClick(service.id)}
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
                  className="flex w-15 shrink-0 cursor-pointer flex-col items-center gap-2"
                >
                  {content}
                </a>
              );
            })}
          </div>
        </section>
      </div>

      {isCopyToastVisible && (
        <div className="pointer-events-none absolute right-0 bottom-[calc(40px+env(safe-area-inset-bottom))] left-0 z-50 flex justify-center">
          <div
            className={`link-share-toast flex h-[54px] w-[343px] max-w-[calc(100%-32px)] items-center justify-center gap-2 rounded-lg bg-black/70 px-4 py-4 text-white ${
              isCopyToastExiting ? 'link-share-toast-exit' : ''
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
              <CheckIcon width={14} height={14} strokeWidth={2.5} />
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
