import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { PartyCurtain } from '@/components/live-party/entry/PartyCurtain';
import { PartyEntryContent } from '@/components/live-party/entry/PartyEntryContent';
import { PartyEntryFooter } from '@/components/live-party/entry/PartyEntryFooter';
import { PartyEntryStage } from '@/components/live-party/entry/PartyEntryStage';
import { HostNotEnter } from '@/components/live-party/entry/HostNotEnter';
import { usePartyEnterIntro } from '@/hooks/live-party/usePartyEnterIntro';
import { useGetPartyParticipants } from '@/services/live-party';

import type { components } from '@/types/api';

interface PartyEntryStepProps {
  onComplete?: () => void;
  isHost: boolean;
}

type PartyParticipant = components['schemas']['PartyParticipantResponse'];

export function PartyEntryStep({ onComplete, isHost }: PartyEntryStepProps) {
  const { partyId = '' } = useParams();

  const { data } = useGetPartyParticipants(partyId, {
    refetchInterval: 3000,
  });

  const participants: PartyParticipant[] = data?.participants ?? [];

  const hasCelebrant = participants.some((participant) => participant.isCelebrant);

  const {
    currentStep,
    isLastStep,
    isExiting,
    isEntering,
    isCurtainOpen,
    showHostNotEnter,
    handleClick,
    handleTextAnimationEnd,
    handleStart,
    handleCelebrantEntered,
  } = usePartyEnterIntro();

  useEffect(() => {
    if (!isCurtainOpen) return;

    const timer = window.setTimeout(() => {
      onComplete?.();
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isCurtainOpen, onComplete]);
  useEffect(() => {
    if (!showHostNotEnter) return;
    if (!hasCelebrant) return;

    handleCelebrantEntered();
  }, [hasCelebrant, showHostNotEnter, handleCelebrantEntered]);

  return (
    <div
      className={`relative h-svh w-full overflow-hidden bg-radial from-[#3D7AE9] to-[#6174FF] ${
        isCurtainOpen ? 'cursor-default' : 'cursor-pointer'
      }`}
      onClick={handleClick}
    >
      <div className="relative mx-auto h-full w-full max-w-[600px]">
        <div
          className={`absolute inset-0 z-1 bg-black transition-opacity duration-500 ${
            isLastStep ? 'opacity-0' : 'opacity-50'
          }`}
        />

        <PartyCurtain isOpen={isCurtainOpen} />

        {!isCurtainOpen && !showHostNotEnter && (
          <>
            <PartyEntryContent
              text={currentStep.text}
              isEntering={isEntering}
              isExiting={isExiting}
              onAnimationEnd={handleTextAnimationEnd}
            />

            <PartyEntryFooter
              showButton={!!currentStep.showButton}
              onStart={(e) => handleStart(e, hasCelebrant, isHost)}
            />
          </>
        )}

        {showHostNotEnter && !isHost && !hasCelebrant && (
          <div className="absolute inset-0 z-20">
            <HostNotEnter participants={participants} />
          </div>
        )}

        {isCurtainOpen && <PartyEntryStage />}
      </div>
    </div>
  );
}
