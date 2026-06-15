import { useEffect, useRef, useState } from 'react';
import { EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { CHARACTER_LABEL_MAP } from '@/constants/character';
import { useCharacters } from '@/services/character';
import { resolveImageUrl } from '@/utils/image';

interface CharacterSelectProps {
  value?: number | null;
  onSelect?: (characterId: number) => void;
}

type ClickableSwiper = SwiperType & {
  allowClick?: boolean;
};

export function CharacterSelect({ value, onSelect }: CharacterSelectProps) {
  const { data: characters = [], isLoading } = useCharacters();
  const swiperRef = useRef<SwiperType | null>(null);
  const [internalId, setInternalId] = useState<number | null>(null);

  const isControlled = value !== undefined;
  const selectedId = isControlled ? value : internalId;
  const selectedIndex = Math.max(
    0,
    characters.findIndex((character) => character.characterId === selectedId),
  );

  useEffect(() => {
    if (characters.length > 0 && selectedId === null) {
      const firstId = characters[0].characterId ?? null;
      if (!isControlled) setInternalId(firstId);
      if (firstId != null) onSelect?.(firstId);
    }
  }, [characters, selectedId, onSelect, isControlled]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      swiperRef.current?.slideTo(selectedIndex);
    }
  }, [selectedIndex]);

  const handleSelect = (characterId: number) => {
    if (!isControlled) setInternalId(characterId);
    onSelect?.(characterId);
  };

  const handleClickCharacter = (index: number, characterId: number) => {
    const swiper = swiperRef.current as ClickableSwiper | null;
    if (swiper?.allowClick === false) return;

    swiperRef.current?.slideTo(index);
    handleSelect(characterId);
  };

  if (isLoading) {
    return <div className="bg-grey-100 h-[230px] w-full animate-pulse rounded-lg" />;
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex h-[230px] w-full items-center">
        <Swiper
          modules={[EffectCoverflow]}
          effect="coverflow"
          slidesPerView="auto"
          centeredSlides
          spaceBetween={24}
          initialSlide={selectedIndex}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            scale: 1,
            slideShadows: false,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            const selectedCharacter = characters[swiper.realIndex];
            const id = selectedCharacter?.characterId;
            if (id != null) handleSelect(id);
          }}
          className="h-full w-full overflow-visible"
        >
          {characters.map((character, index) => {
            const id = character.characterId;
            if (id == null) return null;
            const imageUrl = resolveImageUrl(character.characterImageUrl);

            return (
              <SwiperSlide key={id} className="!flex !w-[200px] items-center justify-center">
                <button
                  type="button"
                  aria-label={`${CHARACTER_LABEL_MAP[id] ?? character.name ?? '캐릭터'} 선택`}
                  aria-current={index === selectedIndex}
                  className="flex h-50 w-50 cursor-pointer items-center justify-center"
                  onClick={() => handleClickCharacter(index, id)}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      aria-hidden="true"
                      className={`h-50 w-50 object-contain transition-opacity duration-200 ${
                        index === selectedIndex ? 'opacity-100' : 'opacity-45'
                      }`}
                    />
                  ) : (
                    <div className="bg-grey-100 h-50 w-50 rounded-full" />
                  )}
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {characters.map((character, index) => {
          const id = character.characterId;
          if (id == null) return null;

          return (
            <button
              key={id}
              type="button"
              aria-label={`${CHARACTER_LABEL_MAP[id] ?? character.name ?? '캐릭터'} 선택`}
              aria-current={index === selectedIndex}
              onClick={() => {
                swiperRef.current?.slideTo(index);
                handleSelect(id);
              }}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                index === selectedIndex ? 'w-3 bg-blue-500' : 'bg-grey-200 w-1.5'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
