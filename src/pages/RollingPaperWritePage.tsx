import { useState } from 'react';

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

  function handleNicknameNext(nickname: string) {
    setFormState((prev) => ({ ...prev, nickname }));
    setStep('message');
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

  if (step === 'nickname') {
    return <RollingPaperNicknameForm onNext={handleNicknameNext} />;
  }

  if (step === 'message') {
    return <RollingPaperMessageForm hostName={hostName} onNext={handleMessageNext} />;
  }

  return (
    <RollingPaperWriteComplete
      hostName={hostName}
      nickname={formState.nickname}
      message={formState.message}
      toppingType={formState.toppingType!}
      onComplete={handleComplete}
    />
  );
}
