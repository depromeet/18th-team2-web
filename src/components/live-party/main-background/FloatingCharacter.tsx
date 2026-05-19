import { characterSizeStyles } from '@/constants/live-party';
import { Caption } from '../../ui/Typography';

interface CharacterInitStyle {
  left: string;
  top?: string;
  bottom?: string;
  animationDuration: string;
  animationDelay: string;
}

interface FloatingCharacterProps {
  image: string;
  name?: string;
  size?: 'xl' | 'lg' | 'sm';
  isHost?: boolean;
  initStyle: CharacterInitStyle;
}

export function FloatingCharacter({
  image,
  name,
  size = 'sm',
  isHost = false,
  initStyle,
}: FloatingCharacterProps) {
  return (
    <div className="absolute" style={{ left: initStyle.left, top: initStyle.top, bottom: initStyle.bottom }}>
      <div
        className={`character-float flex flex-col items-center`}
        style={{
          animationDuration: initStyle.animationDuration,
          animationDelay: initStyle.animationDelay,
        }}
      >
        <img
          src={image}
          alt={name ?? '파티 참여자'}
          draggable={false}
          className={`object-contain select-none ${characterSizeStyles[size].imageWidth}`}
        />
        <Caption as="p" className={`${isHost ? 'text-yellow-400' : 'text-grey-100'} font-semibold`}>
          {name}
        </Caption>
      </div>
    </div>
  );
}
