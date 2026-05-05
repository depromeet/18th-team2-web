import { useState } from 'react';

import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { RollingPaperMessageForm } from '@/components/rolling-paper-write/RollingPaperMessageForm';
import { RollingPaperNicknameForm } from '@/components/rolling-paper-write/RollingPaperNicknameForm';
import { RollingPaperWriteComplete } from '@/components/rolling-paper-write/RollingPaperWriteComplete';
import { ROUTES } from '@/constants/routes';
import type { ToppingType } from '@/services/rolling-paper';
import { useWriteRollingPaper } from '@/services/rolling-paper';

type Step = 'nickname' | 'message' | 'complete';

interface FormState {
  nickname: string;
  message: string;
  toppingType: ToppingType | null;
}

export default function RollingPaperWritePage() {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();

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
    // TODO: 롤링페이퍼 메인 화면으로 이동
    navigate(generatePath(ROUTES.rollingPaper, { id: partyId ?? '' }));
  }

  if (step === 'nickname') {
    return <RollingPaperNicknameForm onNext={handleNicknameNext} />;
  }

  if (step === 'message') {
    return <RollingPaperMessageForm onNext={handleMessageNext} />;
  }

  return (
    <RollingPaperWriteComplete
      nickname={formState.nickname}
      message={formState.message}
      toppingType={formState.toppingType!}
      onComplete={handleComplete}
    />
  );
}
