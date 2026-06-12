import { useState } from 'react';

import { characterSizeStyles } from '@/constants/live-party';
import { Caption } from '@/components/ui/Typography';

interface CharacterInitStyle {
  left: string;
  top?: string;
  bottom?: string;
  animationDuration: string;
  animationDelay: string;
}

interface FloatingCharacterProps {
  image: string;
  name: string;
  size: 'xl' | 'lg' | 'sm';
  isJumping?: boolean;
  initStyle: CharacterInitStyle;
}

const DANCE_DURATION = 1200;

export function FloatingCharacter({
  image,
  name,
  size = 'sm',
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
      className="pointer-events-auto absolute cursor-pointer"
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
              className={`object-contain select-none ${characterSizeStyles[size]}`}
            />
          </div>
          <Caption
            as="p"
            className={`text-white ${size === 'xl' || size === 'lg' ? 'font-semibold' : 'font-normal'} flex items-center gap-0.5 font-semibold`}
          >
            {name}
          </Caption>
        </div>
      </div>
    </div>
  );
}
