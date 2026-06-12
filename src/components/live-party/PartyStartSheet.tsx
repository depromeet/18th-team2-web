import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import { useGetPartyParticipants } from '@/services/live-party';
import { resolveImageUrl } from '@/utils/image';
import type { components } from '@/types/api';

import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { B1, Caption, H2, L1, L2 } from '@/components/ui/Typography';
import { ParticipantAvatarGroup } from '@/components/live-party/ParticipantAvatarGroup';

type PartyParticipant = components['schemas']['PartyParticipantResponse'];

interface PartyStartSheetProps {
  partyId: string;
  onClose: () => void;
  onStart: () => void;
}

export function PartyStartSheet({ partyId, onClose, onStart }: PartyStartSheetProps) {
  const { data } = useGetPartyParticipants(partyId);

  const participants: PartyParticipant[] = data?.participants ?? [];
  const totalCount = data?.totalCount ?? 0;
  const maxCount = data?.maxCount ?? 0;

  const celebrant = participants.find((p) => p.isCelebrant);
  const thumbnailParticipants = participants.slice(0, 3);

  const celebrantSlide = Math.max(
    participants.findIndex((p) => p.isCelebrant),
    0,
  );

  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(celebrantSlide);

  useEffect(() => {
    if (!swiperRef.current) return;

    swiperRef.current.slideTo(celebrantSlide, 0);
    setActiveIndex(celebrantSlide);
  }, [celebrantSlide]);

  return (
    <div className="mb-4 flex h-102.5 w-88.75 flex-col rounded-3xl bg-white px-5 pt-7 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <H2 className="font-semibold">파티를 시작할까요?</H2>
          <B1 className="text-grey-400">친구들이 다 모였는지 확인해 주세요</B1>
        </div>

        <button type="button" onClick={onClose}>
          <CloseIcon className="text-grey-400 h-5 w-5" />
        </button>
      </div>

      <div className="bg-grey-50 mt-4 h-px" />

      <Swiper
        className="h-44 w-full"
        slidesPerView="auto"
        centeredSlides
        centeredSlidesBounds={false}
        watchSlidesProgress
        spaceBetween={10}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;

          requestAnimationFrame(() => {
            swiper.slideTo(celebrantSlide, 0);
            setActiveIndex(celebrantSlide);
          });
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
      >
        {participants.map((participant, index) => {
          const isActive = activeIndex === index;

          return (
            <SwiperSlide
              key={participant.participantId}
              className="flex! h-full w-[120px]! items-center justify-center"
            >
              <div className="flex flex-col items-center">
                <img
                  src={resolveImageUrl(participant.characterImageUrl) ?? ''}
                  alt={participant.nickname}
                  className={`object-contain transition-all duration-300 ease-out ${
                    isActive ? 'h-20 w-20 scale-150' : 'h-20 w-20 scale-100'
                  }`}
                />

                <Caption
                  className={`font-semibold transition-all duration-300 ${isActive ? 'mt-4' : ''}`}
                >
                  {participant.nickname}
                </Caption>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="flex items-center justify-center gap-2">
        <ParticipantAvatarGroup participants={thumbnailParticipants} size="sm" />

        <div className="flex items-center gap-1">
          {celebrant && <L2>{celebrant.nickname}님 외</L2>}

          <L1 className="font-bold text-blue-400">
            {totalCount - 1}/{maxCount}명
          </L1>
        </div>
      </div>

      <Button size="full" className="mt-6" onClick={onStart}>
        파티 시작하기
      </Button>
    </div>
  );
}
