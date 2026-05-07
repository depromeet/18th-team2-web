import { Controller, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { RollingPaperFormFooter } from '@/components/rolling-paper-write/RollingPaperFormFooter';
import { RollingPaperFormHeading } from '@/components/rolling-paper-write/RollingPaperFormHeading';
import { type RollingPaperWriteFormValues } from '@/hooks/rollingPaperWrite/useRollingPaperWriteForm';
import { Button } from '@/components/ui/Button';
import { NicknameInput } from '@/components/ui/NicknameInput';
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
    <main className="bg-gradient-bg flex min-h-screen flex-col">
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
              <NicknameInput
                {...field}
                value={field.value ?? ''}
                placeholder="이름이나 별명을 입력해주세요"
                autoComplete="off"
                error={!!errors.nickname}
                message={errors.nickname?.message}
              />
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
