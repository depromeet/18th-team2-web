import curtainLeft from '@/assets/images/curtain-left.png';
import curtainRight from '@/assets/images/curtain-right.png';
import whiteGradientBig from '@/assets/images/white-gradient-big.png';
import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { B1, T3 } from '@/components/ui/Typography';
import { HighlightedText } from '@/components/party-enter-intro/HighlightedText';
import { WhiteGradientIcon } from '@/components/ui/icons/WhiteGradientIcon';
import { PartyExitDialog } from '@/components/party/PartyExitDialog';
import { usePartyEnterIntro } from '@/hooks/party-enter-intro/usePartyEnterIntro';

export default function PartyEnterIntroPage() {
  const {
    currentScene,
    isLastStep,
    isExiting,
    isEntering,
    isCurtainOpen,
    isExitDialogOpen,
    handleClick,
    handleClose,
    handleCancelExit,
    handleConfirmExit,
    handleTextAnimationEnd,
    handleStart,
  } = usePartyEnterIntro();

  return (
    <div
      className={`relative h-svh w-full overflow-hidden bg-radial from-[#3D7AE9] to-[#6174FF] ${isCurtainOpen ? 'cursor-default' : 'cursor-pointer'}`}
      onClick={handleClick}
    >
      <div className="relative mx-auto h-full w-full max-w-[600px]">
        <div
          className={`absolute inset-0 z-1 bg-black transition-opacity duration-500 ${
            isLastStep ? 'opacity-0' : 'opacity-50'
          }`}
        />
        <div className={`pointer-events-none absolute inset-0 ${isCurtainOpen ? 'z-20' : ''}`}>
          <img
            src={curtainLeft}
            className={`absolute top-0 left-0 h-[calc(100%-52px)] w-1/2 transition-transform duration-700 ease-in-out ${isCurtainOpen ? '-translate-x-full' : ''}`}
          />
          <img
            src={curtainRight}
            className={`absolute top-0 right-0 h-[calc(100%-52px)] w-1/2 transition-transform duration-700 ease-in-out ${isCurtainOpen ? 'translate-x-full' : ''}`}
          />
        </div>
        <header className="absolute top-0 right-0 left-0 z-11 flex justify-end p-4">
          <button onClick={handleClose} className="cursor-pointer">
            <CloseIcon className="text-white" />
          </button>
        </header>
        {!isCurtainOpen && (
          <>
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
              <T3
                className={`text-center text-white ${isExiting ? 'party-enter-text' : isEntering ? 'party-enter-text-in' : ''}`}
                onAnimationEnd={handleTextAnimationEnd}
              >
                {currentScene.text.split('\n').map((string, index) => (
                  <span key={index}>
                    <HighlightedText string={string} />
                    <br />
                  </span>
                ))}
              </T3>
            </div>
            <footer className="absolute right-0 bottom-0 left-0 z-10 flex flex-col items-center pb-48">
              {currentScene.showButton ? (
                <Button onClick={handleStart} className="party-enter-button" size="md">
                  커튼열기
                </Button>
              ) : (
                <>
                  <WhiteGradientIcon className="mb-3" />
                  <B1 as="p" className="font-normal text-white/60">
                    터치하면 다음으로 넘어가요
                  </B1>
                </>
              )}
            </footer>
          </>
        )}
        {isCurtainOpen && (
          <div className="absolute inset-0 z-10">
            <img src={whiteGradientBig} className="absolute top-0 left-0 w-full" />
            <div className="flex h-full flex-col items-center justify-center">
              {/* TODO: 주최자 캐릭터 이미지 */}
              <div className="party-enter-character h-[188px] w-[160px] bg-sky-400" />
              <T3 className="mt-25 text-center text-white">
                오늘의 주인공
                <br />
                현진님이
                <br />
                등장했어요!
              </T3>
            </div>
          </div>
        )}
      </div>
      <PartyExitDialog
        isOpen={isExitDialogOpen}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
