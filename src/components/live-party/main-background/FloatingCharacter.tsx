import { useState } from 'react';

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

const DANCE_DURATION = 1200;

export function FloatingCharacter({
  image,
  name,
  size = 'sm',
  isHost = false,
  isJumping = false,
  initStyle,
}: FloatingCharacterProps) {
  const [isDancing, setIsDancing] = useState(false);

  const handleClick = () => {
    if (isDancing) return;
    setIsDancing(true);
    setTimeout(() => setIsDancing(false), DANCE_DURATION);
  };

  const animationClass = isDancing
    ? 'character-dance'
    : isJumping
      ? size === 'xl'
        ? 'character-jump-xl'
        : size === 'lg'
          ? 'character-jump-lg'
          : 'character-jump'
      : '';

  return (
    <div
      className="absolute cursor-pointer"
      style={{ left: initStyle.left, top: initStyle.top, bottom: initStyle.bottom }}
      onClick={handleClick}
    >
      <div className={animationClass}>
        <div
          className="character-float flex flex-col items-center"
          style={{
            animationDuration: initStyle.animationDuration,
            animationDelay: initStyle.animationDelay,
          }}
        >
          <div className="relative">
            <img
              src={image}
              alt={name ?? '파티 참여자'}
              draggable={false}
              className={`object-contain select-none ${characterSizeStyles[size].imageWidth}`}
            />
          </div>
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
