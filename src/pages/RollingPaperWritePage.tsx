import { useCallback, useState } from 'react';

import { useParams } from 'react-router-dom';

import { RollingPaperMessageForm } from '@/components/rolling-paper-write/RollingPaperMessageForm';
import { RollingPaperNicknameForm } from '@/components/rolling-paper-write/RollingPaperNicknameForm';
import { RollingPaperWriteComplete } from '@/components/rolling-paper-write/RollingPaperWriteComplete';
import type { ToppingType } from '@/services/rolling-paper';
import { useRollingPaper, useWriteRollingPaper } from '@/services/rolling-paper';

type Step = 'nickname' | 'message' | 'complete';

interface FormState {
  nickname: string;
  message: string;
  toppingType: ToppingType | null;
}

export default function RollingPaperWritePage() {
  const { partyId } = useParams<{ partyId: string }>();

  const { data } = useRollingPaper(partyId ?? '');
  const hostName = data?.hostName ?? '';

  const [step, setStep] = useState<Step>('nickname');
  const [formState, setFormState] = useState<FormState>({
    nickname: '',
    message: '',
    toppingType: null,
  });

  const { mutate: writeRollingPaper } = useWriteRollingPaper();

  const handleNicknameDraftChange = useCallback((nickname: string) => {
    setFormState((prev) => (prev.nickname === nickname ? prev : { ...prev, nickname }));
  }, []);

  const handleMessageDraftChange = useCallback(
    (message: string, toppingType: ToppingType | null) => {
      setFormState((prev) =>
        prev.message === message && prev.toppingType === toppingType
          ? prev
          : { ...prev, message, toppingType },
      );
    },
    [],
  );

  function handleNicknameNext(nickname: string) {
    setFormState((prev) => ({ ...prev, nickname }));
    setStep('message');
  }

  function handleMessageBack(message: string, toppingType: ToppingType | null) {
    setFormState((prev) => ({ ...prev, message, toppingType }));
    setStep('nickname');
  }

  function handleMessageNext(message: string, toppingType: ToppingType) {
    if (!partyId) return;

    setFormState((prev) => ({ ...prev, message, toppingType }));

    writeRollingPaper(
      {
        partyId,
        writerName: formState.nickname,
        content: message,
        toppingType,
      },
      {
        onSuccess: () => setStep('complete'),
      },
    );
  }

  function handleComplete() {
    // TODO: 롤링페이퍼_메인_참가자 화면으로 이동
  }

  function handleCompleteBack() {
    setStep('message');
  }

  if (step === 'nickname') {
    return (
      <RollingPaperNicknameForm
        initialNickname={formState.nickname}
        onChange={handleNicknameDraftChange}
        onNext={handleNicknameNext}
      />
    );
  }

  if (step === 'message') {
    return (
      <RollingPaperMessageForm
        hostName={hostName}
        initialMessage={formState.message}
        initialToppingType={formState.toppingType}
        onChange={handleMessageDraftChange}
        onBack={handleMessageBack}
        onNext={handleMessageNext}
      />
    );
  }

  return (
    <RollingPaperWriteComplete
      hostName={hostName}
      nickname={formState.nickname}
      message={formState.message}
      toppingType={formState.toppingType!}
      onBack={handleCompleteBack}
      onComplete={handleComplete}
    />
  );
}
