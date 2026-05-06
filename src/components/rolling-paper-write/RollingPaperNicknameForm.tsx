import { Controller, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { NicknameInput } from '@/components/rolling-paper-write/NicknameInput';
import { RollingPaperFormFooter } from '@/components/rolling-paper-write/RollingPaperFormFooter';
import { RollingPaperFormHeading } from '@/components/rolling-paper-write/RollingPaperFormHeading';
import { type RollingPaperWriteFormValues } from '@/components/rolling-paper-write/useRollingPaperWriteForm';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

interface RollingPaperNicknameFormProps {
  onNext: () => void;
}

export function RollingPaperNicknameForm({ onNext }: RollingPaperNicknameFormProps) {
  const navigate = useNavigate();

  const {
    watch,
    trigger,
    control,
    formState: { errors },
  } = useFormContext<RollingPaperWriteFormValues>();

  const nickname = watch('nickname') ?? '';
  const isReady = nickname.length > 0 && !errors.nickname;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await trigger('nickname');
    if (ok) onNext();
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-bg">
      <PageHeader onBack={() => navigate(-1)} />

      <section className="flex flex-1 flex-col gap-7 px-4 pt-5">
        <RollingPaperFormHeading
          title="어떤 이름으로 메세지를 남길까요?"
          description="생일자에게 보여질 이름을 입력해주세요."
        />

        <form id="nickname-form" onSubmit={handleSubmit} noValidate>
          <Controller
            control={control}
            name="nickname"
            render={({ field }) => (
              <NicknameInput field={field} errorMessage={errors.nickname?.message} />
            )}
          />
        </form>
      </section>

      <RollingPaperFormFooter>
        <Button
          type="submit"
          form="nickname-form"
          variant={isReady ? 'white-blue' : 'secondary'}
          size="full"
          disabled={!isReady}
          className="disabled:opacity-100"
        >
          롤링페이퍼 작성하러 가기
        </Button>
      </RollingPaperFormFooter>
    </main>
  );
}
