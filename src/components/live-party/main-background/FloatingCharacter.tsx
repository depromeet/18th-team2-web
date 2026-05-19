import { characterSizeStyles } from '@/constants/live-party';
import { Caption } from '@/components/ui/Typography';
import StarIconSvg from '@/assets/images/live-party/star.svg?react';

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
  isJumping?: boolean;
  initStyle: CharacterInitStyle;
}

export function FloatingCharacter({
  image,
  name,
  size = 'sm',
  isHost = false,
  isJumping = false,
  initStyle,
}: FloatingCharacterProps) {
  return (
    <div
      className="absolute"
      style={{ left: initStyle.left, top: initStyle.top, bottom: initStyle.bottom }}
    >
      <div
        className={
          isJumping
            ? size === 'xl'
              ? 'character-jump-xl'
              : size === 'lg'
                ? 'character-jump-lg'
                : 'character-jump'
            : ''
        }
      >
        <div
          className="character-float flex flex-col items-center"
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
          <Caption
            as="p"
            className={`${isHost ? 'text-yellow-400' : 'text-grey-100'} flex items-center gap-0.5 font-semibold`}
          >
            {name}
            {isHost && <StarIconSvg />}
          </Caption>
        </div>
      </div>
    </div>
  );
}
