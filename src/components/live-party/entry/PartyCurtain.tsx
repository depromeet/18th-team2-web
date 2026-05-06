import curtainLeft from '@/assets/images/curtain-left.png';
import curtainRight from '@/assets/images/curtain-right.png';

interface PartyCurtainProps {
  isOpen: boolean;
}

export function PartyCurtain({ isOpen }: PartyCurtainProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${isOpen ? 'z-20' : ''}`}>
      <img
        alt=""
        src={curtainLeft}
        className={`absolute top-0 left-0 h-[calc(100%-52px)] w-1/2 transition-transform duration-700 ease-in-out ${
          isOpen ? '-translate-x-full' : ''
        }`}
      />
      <img
        src={curtainRight}
        className={`absolute top-0 right-0 h-[calc(100%-52px)] w-1/2 transition-transform duration-700 ease-in-out ${
          isOpen ? 'translate-x-full' : ''
        }`}
      />
    </div>
  );
}
