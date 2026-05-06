import { T3 } from '@/components/ui/Typography';
import { MultilineText } from './MultilineText';

interface PartyIntroContentProps {
  text: string;
  isEntering: boolean;
  isExiting: boolean;
  onAnimationEnd: () => void;
}

export function PartyIntroContent({
  text,
  isEntering,
  isExiting,
  onAnimationEnd,
}: PartyIntroContentProps) {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
      <T3
        className={`text-center text-white ${
          isExiting ? 'party-enter-text' : isEntering ? 'party-enter-text-in' : ''
        }`}
        onAnimationEnd={onAnimationEnd}
      >
        <MultilineText text={text} />
      </T3>
    </div>
  );
}
