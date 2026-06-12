import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useGetPartyParticipants } from '@/services/live-party';
import { resolveImageUrl } from '@/utils/image';
import type { components } from '@/types/api';

import { Button } from '../ui/Button';
import { CloseIcon } from '../ui/icons/CloseIcon';
import { B1, Caption, H2, L1, L2 } from '../ui/Typography';

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

  const initialSlide = participants.findIndex((p) => p.isCelebrant);

  const celebrantSlide = initialSlide >= 0 ? initialSlide : 0;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(celebrantSlide);
  }, [celebrantSlide]);

  return (
    <div className="mb-4 flex h-102.5 w-88.75 flex-col rounded-3xl bg-white px-5 pt-8 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <H2 className="font-semibold">파티를 시작할까요?</H2>

          <B1 className="text-gray-400">친구들이 다 모였는지 확인해 주세요</B1>
        </div>

        <button type="button" onClick={onClose}>
          <CloseIcon className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="mt-4 h-px bg-gray-50" />

      <Swiper
        className="h-44 w-full"
        slidesPerView="auto"
        centeredSlides
        centeredSlidesBounds
        watchSlidesProgress
        spaceBetween={10}
        initialSlide={initialSlide}
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
        <div className="flex -space-x-2">
          {thumbnailParticipants.map((participant) => (
            <img
              key={participant.participantId}
              src={resolveImageUrl(participant.characterImageUrl) ?? ''}
              alt={participant.nickname}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-white"
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          {celebrant && <L2>{celebrant.nickname}님 외</L2>}

          <L1 className="font-bold text-blue-400">
            {totalCount}/{maxCount}명
          </L1>
        </div>
      </div>

      <Button size="full" className="mt-6" onClick={onStart}>
        파티 시작하기
      </Button>
    </div>
  );
}
