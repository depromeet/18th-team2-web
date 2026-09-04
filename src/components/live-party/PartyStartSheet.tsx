import { useEffect, useMemo, useRef, useState } from 'react';
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

  const participants: PartyParticipant[] = useMemo(
    () => data?.participants ?? [],
    [data?.participants],
  );
  const totalCount = data?.totalCount ?? 0;
  const maxCount = data?.maxCount ?? 0;

  const orderedParticipants = useMemo(
    () => [...participants].sort((a, b) => Number(b.isMe) - Number(a.isMe)),
    [participants],
  );
  const representativeParticipant = orderedParticipants[0];
  const thumbnailParticipants = orderedParticipants.slice(0, 3);

  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!swiperRef.current) return;

    swiperRef.current.slideTo(0, 0);
    setActiveIndex(0);
  }, [orderedParticipants]);

  return (
    <div className="mb-4 flex h-114 max-h-[calc(100svh-32px-env(safe-area-inset-bottom))] w-[calc(100vw-20px)] max-w-88.75 flex-col overflow-y-auto rounded-2xl bg-white px-5 pt-3 pb-5 shadow-lg">
      <div className="mt-5 flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <H2 className="font-semibold">정말로 파티를 시작할까요?</H2>
          <B1 className="text-grey-400 whitespace-pre-line">
            파티는 시작하면 멈출 수 없어요{'\n'}친구들이 모두 모였는지 확인해 주세요
          </B1>
        </div>

        <button
          type="button"
          aria-label="파티 시작 확인창 닫기"
          className="-mt-2 -mr-2 flex h-10 w-10 shrink-0 items-center justify-center"
          onClick={onClose}
        >
          <CloseIcon className="text-grey-400 h-5 w-5" />
        </button>
      </div>

      <div className="bg-grey-50 mt-5 h-px" />

      <Swiper
        className="mt-2 h-42 w-full"
        slidesPerView="auto"
        centeredSlides
        centeredSlidesBounds={false}
        watchSlidesProgress
        spaceBetween={0}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;

          requestAnimationFrame(() => {
            swiper.slideTo(0, 0);
            setActiveIndex(0);
          });
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
      >
        {orderedParticipants.map((participant, index) => {
          const isActive = activeIndex === index;

          return (
            <SwiperSlide
              key={participant.participantId}
              className="flex! h-full w-[104px]! items-center justify-center"
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

        <div className="flex min-w-0 items-center gap-1">
          {representativeParticipant && (
            <L2 className="max-w-38 truncate">{representativeParticipant.nickname}님 외</L2>
          )}

          <L1 className="font-bold text-blue-400">
            {totalCount}/{maxCount}명
          </L1>
        </div>
      </div>

      <Button size="full" className="mt-auto" onClick={onStart}>
        시작할게요
      </Button>
    </div>
  );
}
