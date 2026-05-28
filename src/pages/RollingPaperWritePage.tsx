import { useEffect, useState } from 'react';

import { FormProvider } from 'react-hook-form';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';

import { RollingPaperMessageForm } from '@/components/rolling-paper-write/RollingPaperMessageForm';
import { RollingPaperNicknameForm } from '@/components/rolling-paper-write/RollingPaperNicknameForm';
import { RollingPaperWriteComplete } from '@/components/rolling-paper-write/RollingPaperWriteComplete';
import { useRollingPaperWriteForm } from '@/hooks/rollingPaperWrite/useRollingPaperWriteForm';
import { ROUTES } from '@/constants/routes';
import { useWriteRollingPaper } from '@/services/rolling-paper';

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
  const [writeError, setWriteError] = useState<string | null>(null);

  // inviteToken 없이 직접 URL 접근 시 홈으로 이동
  useEffect(() => {
    if (!inviteToken) {
      navigate(ROUTES.home, { replace: true });
    }
  }, [inviteToken, navigate]);

  const methods = useRollingPaperWriteForm();
  const { mutate: writeRollingPaper, isPending } = useWriteRollingPaper();

  function handleMessageSubmit() {
    if (!partyId || !inviteToken) return;
    const { nickname, message, toppingType } = methods.getValues();
    if (!toppingType) return;

    setWriteError(null);
    writeRollingPaper(
      { inviteToken, writerNickname: nickname, content: message, toppingType },
      {
        onSuccess: () => setStep('complete'),
        onError: () => setWriteError('롤링페이퍼 작성에 실패했어요. 초대장을 다시 확인해주세요.'),
      },
    );
  }

  function handleComplete() {
    if (!partyId) return;

    navigate(generatePath(ROUTES.rollingPaper, { id: partyId }), {
      replace: true,
      state: {
        mode: 'write-complete',
        completeCta: locationState?.completeCta,
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
      {writeError && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-3 text-sm text-white">
          {writeError}
        </div>
      )}
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
