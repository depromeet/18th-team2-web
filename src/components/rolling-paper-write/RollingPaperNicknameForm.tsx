import { useState } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { NicknameInput } from '@/components/rolling-paper-write/NicknameInput';
import { RollingPaperFormFooter } from '@/components/rolling-paper-write/RollingPaperFormFooter';
import { type RollingPaperWriteFormValues } from '@/components/rolling-paper-write/useRollingPaperWriteForm';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { B1, H1 } from '@/components/ui/Typography';
import { getGraphemeLength } from '@/utils/text';

interface RollingPaperNicknameFormProps {
  onNext: () => void;
}

export function RollingPaperNicknameForm({ onNext }: RollingPaperNicknameFormProps) {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);

  const {
    watch,
    trigger,
    control,
    formState: { errors },
  } = useFormContext<RollingPaperWriteFormValues>();

  const nickname = watch('nickname') ?? '';
  const charCount = getGraphemeLength(nickname);
  const isReady = charCount > 0 && !errors.nickname;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await trigger('nickname');
    if (ok) onNext();
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-bg">
      <PageHeader onBack={() => navigate(-1)} />

      <section className="flex flex-1 flex-col gap-7 px-4 pt-5">
        <div className="flex flex-col gap-2">
          <H1 as="h1" className="text-black">
            어떤 이름으로 메세지를 남길까요?
          </H1>
          <B1 className="font-medium text-grey-500">생일자에게 보여질 이름을 입력해주세요.</B1>
        </div>

        <form id="nickname-form" onSubmit={handleSubmit} noValidate>
          <Controller
            control={control}
            name="nickname"
            render={({ field }) => (
              <NicknameInput
                field={field}
                isFocused={isFocused}
                errorMessage={errors.nickname?.message}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
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
