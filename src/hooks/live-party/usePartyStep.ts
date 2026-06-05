import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import {
  LIVE_PARTY_STEP,
  OVERLAY_FADE_DURATION,
  OVERLAY_TRANSITION_STEPS,
  PARTICIPANT_TOKEN_KEY,
  PARTY_USER,
  STEP_DELAY_DURATION,
  type PartyStep,
  type PartyUserRole,
} from '@/constants/live-party';
import { useGetPhase, useAdvancePhase, type PartyApiPhase } from '@/services/live-party';

function apiPhaseToStep(phase: PartyApiPhase | null | undefined): PartyStep {
  switch (phase) {
    case 'MUSIC':
      return LIVE_PARTY_STEP.MUSIC;
    case 'CANDLE':
      return LIVE_PARTY_STEP.CANDLE;
    case 'BURST':
      return LIVE_PARTY_STEP.PINATA;
    case 'CLOSEABLE':
    case 'END':
      return LIVE_PARTY_STEP.END;
    default:
      return LIVE_PARTY_STEP.ENTRY;
  }
}

function stepToApiPhase(step: PartyStep): PartyApiPhase {
  switch (step) {
    case LIVE_PARTY_STEP.MUSIC:
      return 'MUSIC';
    case LIVE_PARTY_STEP.CANDLE:
      return 'CANDLE';
    case LIVE_PARTY_STEP.PINATA:
      return 'BURST';
    case LIVE_PARTY_STEP.END:
      return 'END';
    default:
      return 'ENTRY';
  }
}

interface UseLivePartyStepOptions {
  initialUserRole?: PartyUserRole;
  onEntryComplete?: () => void;
}

export function useLivePartyStep({
  initialUserRole = PARTY_USER.PARTICIPANT_NOT_WRITTEN,
  onEntryComplete,
}: UseLivePartyStepOptions = {}) {
  const { partyId } = useParams<{ partyId: string }>();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<PartyStep>(LIVE_PARTY_STEP.ENTRY);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: phaseData } = useGetPhase(partyId);
  const { mutate: advancePhase } = useAdvancePhase();

  const apiPhase = phaseData?.data?.phase ?? null;
  const prevApiPhaseRef = useRef<PartyApiPhase | null>(null);
  const stepRef = useRef<PartyStep>(LIVE_PARTY_STEP.ENTRY);
  const isTransitioningRef = useRef(false);

  // stepRef를 항상 최신 step으로 동기화
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // apiPhase 변화 감지 → 화면 전환 (SSE party-phase-changed 및 폴링 공통 처리)
  useEffect(() => {
    if (apiPhase === prevApiPhaseRef.current) return;

    const isInitialLoad = prevApiPhaseRef.current === null;
    prevApiPhaseRef.current = apiPhase;

    const newStep = apiPhaseToStep(apiPhase);

    // 최초 로드: 애니메이션 없이 바로 설정
    if (isInitialLoad) {
      setStep(newStep);
      return;
    }

    // handleNextStep이 이미 전환을 관리 중이면 중복 처리 방지
    if (isTransitioningRef.current) return;

    // SSE/폴링으로 phase가 변경된 경우 전환 애니메이션 실행
    const currentStep = stepRef.current;
    const isTransitionStep = OVERLAY_TRANSITION_STEPS.includes(currentStep);

    if (isTransitionStep) {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      window.setTimeout(() => {
        setStep(newStep);
        window.setTimeout(() => {
          isTransitioningRef.current = false;
          setIsTransitioning(false);
        }, STEP_DELAY_DURATION);
      }, OVERLAY_FADE_DURATION);
    } else {
      setStep(newStep);
    }
  }, [apiPhase]);

  const handleNextStep = () => {
    if (!partyId) return;

    if (step === LIVE_PARTY_STEP.ENTRY) {
      onEntryComplete?.();
    }

    const currentApiPhase = stepToApiPhase(step);
    const isTransitionStep = OVERLAY_TRANSITION_STEPS.includes(step);

    if (isTransitionStep) {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
    }

    advancePhase(
      {
        partyId,
        currentPhase: currentApiPhase,
        participantToken: sessionStorage.getItem(PARTICIPANT_TOKEN_KEY),
      },
      {
        onSuccess: (data) => {
          const newStep = apiPhaseToStep(data?.data?.phase);

          if (isTransitionStep) {
            window.setTimeout(() => {
              setStep(newStep);
              queryClient.setQueryData(['partyPhase', partyId], data);

              window.setTimeout(() => {
                isTransitioningRef.current = false;
                setIsTransitioning(false);
              }, STEP_DELAY_DURATION);
            }, OVERLAY_FADE_DURATION);
          } else {
            setStep(newStep);
            queryClient.setQueryData(['partyPhase', partyId], data);
          }
        },
        onError: () => {
          isTransitioningRef.current = false;
          setIsTransitioning(false);
        },
      },
    );
  };

  const userRole = initialUserRole;
  const partyEnd = step === LIVE_PARTY_STEP.END;
  const showChatBottomSheet =
    step !== LIVE_PARTY_STEP.ENTRY &&
    step !== LIVE_PARTY_STEP.END &&
    step !== LIVE_PARTY_STEP.CANDLE;

  return {
    step,
    userRole,
    isTransitioning,
    partyEnd,
    showChatBottomSheet,
    handleNextStep,
  };
}
