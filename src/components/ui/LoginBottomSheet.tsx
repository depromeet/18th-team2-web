import { redirectToKakaoLogin } from '@/services/auth';

interface LoginBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginBottomSheet({ isOpen, onClose }: LoginBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-slide-up relative mx-auto w-full max-w-150 rounded-t-3xl bg-white px-5 pt-3 pb-10">
        <div className="bg-grey-200 mx-auto mb-4 h-1 w-10 rounded-full" />
        <div className="flex items-start justify-between">
          <h2 className="text-head-1 font-semibold">
            파티를 만들기 위해서는
            <br />
            로그인이 필요해요
          </h2>
          <button type="button" className="text-grey-400 p-1" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FEE500] py-4 font-semibold text-[#191919]"
          onClick={redirectToKakaoLogin}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 3C5.58 3 2 5.79 2 9.2c0 2.16 1.42 4.06 3.56 5.14l-.9 3.33c-.08.28.24.5.48.34l3.96-2.63c.29.03.59.04.9.04 4.42 0 8-2.79 8-6.22S14.42 3 10 3z"
              fill="#191919"
            />
          </svg>
          카카오로 3초만에 시작하기
        </button>
      </div>
    </div>
  );
}
