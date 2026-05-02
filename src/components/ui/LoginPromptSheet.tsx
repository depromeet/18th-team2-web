import { redirectToKakaoLogin } from '@/services/auth';
import { H3 } from '@/components/ui/Typography';
import kakaoIcon from '@/assets/icons/icon-kakao.svg';

interface LoginPromptSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginPromptSheet({ isOpen, onClose }: LoginPromptSheetProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-93.75 px-2.5 pb-6 transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="relative rounded-2xl bg-white px-5 pt-3 pb-5">
          <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-grey-100" />
          <button
            type="button"
            className="absolute top-4 right-5 text-grey-400"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <H3 className="mb-5 text-grey-900">
            파티를 만들기 위해서는
            <br />
            로그인이 필요해요
          </H3>
          <button
            type="button"
            className="flex h-14 w-full items-center justify-center gap-1 rounded-btn-lg bg-[#FEE500] text-body-1 font-semibold text-[#191919]"
            onClick={redirectToKakaoLogin}
          >
            <img src={kakaoIcon} alt="" className="h-5 w-5" />
            카카오로 3초만에 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
