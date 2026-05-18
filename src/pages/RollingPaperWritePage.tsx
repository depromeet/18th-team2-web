import { useState } from 'react';

import { FormProvider } from 'react-hook-form';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';

import { RollingPaperMessageForm } from '@/components/rolling-paper-write/RollingPaperMessageForm';
import { RollingPaperNicknameForm } from '@/components/rolling-paper-write/RollingPaperNicknameForm';
import { RollingPaperWriteComplete } from '@/components/rolling-paper-write/RollingPaperWriteComplete';
import { useRollingPaperWriteForm } from '@/hooks/rollingPaperWrite/useRollingPaperWriteForm';
import { ROUTES } from '@/constants/routes';
import { useWriteRollingPaper } from '@/services/rolling-paper';
import type { RollingPaperMessage } from '@/services/rolling-paper';

type Step = 'nickname' | 'message' | 'complete';

interface RollingPaperWriteLocationState {
  completeCta?: 'invite' | 'home';
  invitePath?: string;
  inviteToken?: string;
  hostName?: string;
}

export default function RollingPaperWritePage() {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as RollingPaperWriteLocationState | null;

  const hostName = locationState?.hostName ?? '';
  const inviteToken = locationState?.inviteToken ?? '';

  const [step, setStep] = useState<Step>('nickname');

  const methods = useRollingPaperWriteForm();
  const { mutate: writeRollingPaper, isPending } = useWriteRollingPaper();

  function handleMessageSubmit() {
    if (!partyId || !inviteToken) return;
    const { nickname, message, toppingType } = methods.getValues();
    if (!toppingType) return;

    writeRollingPaper(
      { inviteToken, writerNickname: nickname, content: message, toppingType },
      { onSuccess: () => setStep('complete') },
    );
  }

  function handleComplete() {
    if (!partyId) return;
    const { nickname, message, toppingType } = methods.getValues();
    if (!toppingType) return;

    const completedMessage: RollingPaperMessage = {
      id: `completed-${Date.now()}`,
      writerName: nickname,
      content: message,
      toppingType,
    };

    navigate(generatePath(ROUTES.rollingPaper, { id: partyId }), {
      replace: true,
      state: {
        mode: 'write-complete',
        completeCta: locationState?.completeCta,
        completedMessage,
        invitePath: locationState?.invitePath,
        inviteToken,
      },
    });
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
