import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { B2, H1 } from '@/components/ui/Typography';

const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(1, '닉네임을 입력해주세요')
    .max(10, '닉네임은 10자 이하로 입력해주세요'),
});

type NicknameFormValues = z.infer<typeof nicknameSchema>;

interface NicknameStepProps {
  onNext: (nickname: string) => void;
}

export function RollingPaperNicknameForm({ onNext }: NicknameStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NicknameFormValues>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
  });

  const nickname = watch('nickname', '');

  function onSubmit({ nickname }: NicknameFormValues) {
    onNext(nickname);
  }

  return (
    <main className="bg-gradient-bg flex min-h-screen flex-col">
      <section className="flex flex-1 flex-col gap-8 px-4 pt-16">
        <H1 as="h1" className="text-center tracking-[-0.0002em] text-black">
          롤링페이퍼에 남길
          <br />
          닉네임을 입력해주세요
        </H1>

        <form id="nickname-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-2">
            <div
              className={`flex items-center rounded-btn-md border px-4 py-3.5 ${
                errors.nickname ? 'border-red-500' : 'border-grey-100 focus-within:border-blue-500'
              }`}
            >
              <input
                {...register('nickname')}
                type="text"
                maxLength={10}
                placeholder="닉네임 입력 (최대 10자)"
                autoComplete="off"
                className="w-full bg-transparent text-body-1 text-black outline-none placeholder:text-grey-300"
              />
            </div>
            {errors.nickname && (
              <B2 as="p" className="text-red-500">
                {errors.nickname.message}
              </B2>
            )}
          </div>
        </form>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto flex h-27.5 w-full max-w-150 items-end bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_40.91%)] px-4 pb-6">
        <Button
          type="submit"
          form="nickname-form"
          variant="primary"
          size="full"
          disabled={!nickname || !!errors.nickname}
        >
          다음
        </Button>
      </div>
    </main>
  );
}
