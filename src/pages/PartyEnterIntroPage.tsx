import whiteGradient from '@/assets/images/white_gradient.svg';
import curtainLeft from '@/assets/images/curtain-left.png';
import curtainRight from '@/assets/images/curtain-right.png';
import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { B1, T3 } from '@/components/ui/Typography';
import { useState } from 'react';
import { SCENES } from '@/constants/party-enter-intro';
import { HighlightedText } from '@/components/party-enter-intro/HighlightedText';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function PartyEnterIntroPage() {
  const [step, setStep] = useState(0);
  const currentScene = SCENES[step];
  const isLastStep = step === SCENES.length - 1;
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLastStep) return;
    setStep((prev) => prev + 1);
  };

  const handleClose = () => {
    navigate(ROUTES.home);
  };

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: 파티 입장
  };

  return (
    <div
      className="relative h-svh w-full cursor-pointer overflow-hidden bg-radial from-[#3D7AE9] to-[#6174FF]"
      onClick={handleClick}
    >
      <div className="relative mx-auto h-full w-full max-w-[600px]">
        <div
          className={`absolute inset-0 z-1 bg-black transition-opacity duration-500 ${
            isLastStep ? 'opacity-0' : 'opacity-50'
          }`}
        />
        <div className="pointer-events-none absolute inset-0">
          <img
            src={curtainLeft}
            className={`absolute top-0 left-0 h-[calc(100%-52px)] w-1/2 transition-opacity duration-300`}
          />
          <img
            src={curtainRight}
            className={`absolute top-0 right-0 h-[calc(100%-52px)] w-1/2 transition-opacity duration-300`}
          />
        </div>
        <header className="absolute top-0 right-0 left-0 z-11 flex justify-end p-4">
          <button onClick={handleClose} className="cursor-pointer">
            <CloseIcon className="text-white" />
          </button>
        </header>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
          <T3 key={step} className="party-enter-text text-center text-white">
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
              <img src={whiteGradient} alt="" aria-hidden className="mb-4 h-[60px] w-[60px]" />
              <B1 as="p" className="font-normal text-white/60">
                터치하면 다음으로 넘어가요
              </B1>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
