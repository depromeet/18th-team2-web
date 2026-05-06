import { useState } from 'react';

import { FormProvider } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { RollingPaperMessageForm } from '@/components/rolling-paper-write/RollingPaperMessageForm';
import { RollingPaperNicknameForm } from '@/components/rolling-paper-write/RollingPaperNicknameForm';
import { RollingPaperWriteComplete } from '@/components/rolling-paper-write/RollingPaperWriteComplete';
import { useRollingPaperWriteForm } from '@/components/rolling-paper-write/useRollingPaperWriteForm';
import { useRollingPaper, useWriteRollingPaper } from '@/services/rolling-paper';

type Step = 'nickname' | 'message' | 'complete';

export default function RollingPaperWritePage() {
  const { partyId } = useParams<{ partyId: string }>();

  const { data } = useRollingPaper(partyId ?? '');
  const hostName = data?.hostName ?? '';

  const [step, setStep] = useState<Step>('nickname');

  const methods = useRollingPaperWriteForm();
  const { mutate: writeRollingPaper, isPending } = useWriteRollingPaper();

  function handleMessageSubmit() {
    if (!partyId) return;
    const { nickname, message, toppingType } = methods.getValues();
    if (!toppingType) return;

    writeRollingPaper(
      {
        partyId,
        writerName: nickname,
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

  if (step === 'complete') {
    const { nickname, message, toppingType } = methods.getValues();
    if (!toppingType) return null;

    return (
      <RollingPaperWriteComplete
        hostName={hostName}
        nickname={nickname}
        message={message}
        toppingType={toppingType}
        onBack={() => setStep('message')}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <FormProvider {...methods}>
      {step === 'nickname' && <RollingPaperNicknameForm onNext={() => setStep('message')} />}
      {step === 'message' && (
        <RollingPaperMessageForm
          hostName={hostName}
          onBack={() => setStep('nickname')}
          onNext={isPending ? () => undefined : handleMessageSubmit}
        />
      )}
    </FormProvider>
  );
}
