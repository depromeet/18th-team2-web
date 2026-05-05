import kakaoIcon from '@/assets/icons/icon-kakao.svg';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { H3 } from '@/components/ui/Typography';
import { redirectToKakaoLogin } from '@/services/auth';

interface LoginPromptSheetProps {
  isOpen: boolean;
  onClose: () => void;
  description?: string;
}

export function LoginPromptSheet({ isOpen, onClose, description = '파티를 만들기 위해서는\n로그인이 필요해요' }: LoginPromptSheetProps) {
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
          <div className="bg-grey-100 mx-auto mb-3 h-1 w-9 rounded-full" />
          <button type="button" className="text-grey-400 absolute top-4 right-5" onClick={onClose}>
            <CloseIcon width={20} height={20} />
          </button>
          <H3 className="text-grey-900 mb-5 whitespace-pre-line">
            {description}
          </H3>
          <button
            type="button"
            className="rounded-btn-lg text-body-1 flex h-14 w-full items-center justify-center gap-1 bg-[#FEE500] font-semibold text-[#191919]"
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
