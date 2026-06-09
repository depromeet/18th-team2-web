import { useEffect, useState } from 'react';

import { FormProvider } from 'react-hook-form';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';

import { RollingPaperMessageForm } from '@/components/rolling-paper-write/RollingPaperMessageForm';
import { RollingPaperNicknameForm } from '@/components/rolling-paper-write/RollingPaperNicknameForm';
import { RollingPaperWriteComplete } from '@/components/rolling-paper-write/RollingPaperWriteComplete';
import { useRollingPaperWriteForm } from '@/hooks/rollingPaperWrite/useRollingPaperWriteForm';
import { ROUTES } from '@/constants/routes';
import { ApiError } from '@/services/api';
import { useWriteRollingPaper } from '@/services/rolling-paper';
import {
  readRollingPaperWriteContext,
  saveRollingPaperWriteContext,
} from '@/utils/rollingPaperWrite';

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
  const queryInviteToken = new URLSearchParams(location.search).get('inviteToken') ?? undefined;
  const storedContext = partyId ? readRollingPaperWriteContext(partyId) : null;

  const completeCta = locationState?.completeCta ?? storedContext?.completeCta;
  const invitePath = locationState?.invitePath ?? storedContext?.invitePath;
  const inviteToken = locationState?.inviteToken ?? queryInviteToken ?? storedContext?.inviteToken ?? '';
  const hostName = locationState?.hostName ?? storedContext?.hostName ?? '';

  const [step, setStep] = useState<Step>('nickname');
  const [writeError, setWriteError] = useState<string | null>(null);

  // inviteToken 없이 직접 URL 접근 시 홈으로 이동
  useEffect(() => {
    if (!inviteToken) {
      navigate(ROUTES.home, { replace: true });
    }
  }, [inviteToken, navigate]);

  useEffect(() => {
    if (!partyId || !inviteToken) return;

    saveRollingPaperWriteContext(partyId, {
      completeCta,
      invitePath,
      inviteToken,
      hostName,
    });
  }, [completeCta, hostName, invitePath, inviteToken, partyId]);

  const methods = useRollingPaperWriteForm();
  const { mutate: writeRollingPaper, isPending } = useWriteRollingPaper();

  function getWriteErrorMessage(error: unknown) {
    if (!(error instanceof ApiError)) {
      return '롤링페이퍼 작성에 실패했어요. 잠시 후 다시 시도해주세요.';
    }

    if (error.status === 409) return '이미 롤링페이퍼를 작성했어요.';
    if (error.status === 400 || error.status === 410) return '롤링페이퍼 작성 기간이 아니에요.';
    if (error.status === 403 || error.status === 404) return '사용할 수 없는 초대장이에요.';
    return error.message || '롤링페이퍼 작성에 실패했어요. 잠시 후 다시 시도해주세요.';
  }

  function handleMessageSubmit() {
    if (!partyId || !inviteToken) {
      setWriteError('초대장 정보를 확인할 수 없어요. 초대장 링크로 다시 접속해주세요.');
      return;
    }
    const { nickname, message, toppingType } = methods.getValues();
    if (!toppingType) return;

    setWriteError(null);
    writeRollingPaper(
      { inviteToken, writerNickname: nickname, content: message, toppingType },
      {
        onSuccess: () => setStep('complete'),
        onError: (error) => setWriteError(getWriteErrorMessage(error)),
      },
    );
  }

  function handleComplete() {
    if (!partyId) return;

    navigate(generatePath(ROUTES.rollingPaper, { id: partyId }), {
      replace: true,
      state: {
        mode: 'write-complete',
        completeCta,
        invitePath,
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
