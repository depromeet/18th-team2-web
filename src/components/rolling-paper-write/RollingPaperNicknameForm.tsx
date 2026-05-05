import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { TextInput } from '@/components/ui/TextInput';
import { B1, H1 } from '@/components/ui/Typography';

const MAX_NICKNAME_LENGTH = 10;

const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(1, '닉네임을 입력해주세요')
    .max(MAX_NICKNAME_LENGTH, `닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요`),
});

type NicknameFormValues = z.infer<typeof nicknameSchema>;

interface RollingPaperNicknameFormProps {
  initialNickname?: string;
  onChange?: (nickname: string) => void;
  onNext: (nickname: string) => void;
}

export function RollingPaperNicknameForm({
  initialNickname = '',
  onChange,
  onNext,
}: RollingPaperNicknameFormProps) {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [maxLengthErrorMessage, setMaxLengthErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<NicknameFormValues>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
    defaultValues: {
      nickname: initialNickname,
    },
  });

  const nickname = watch('nickname', '');
  const charCount = Array.from(nickname ?? '').length;
  const helperText = maxLengthErrorMessage ?? errors.nickname?.message;
  const isError = helperText !== undefined && helperText !== null;
  const isReady = charCount > 0 && !isError;

  useEffect(() => {
    onChange?.(nickname ?? '');
  }, [nickname, onChange]);

  const { onChange: registerOnChange, onBlur: registerOnBlur, ...registerRest } = register('nickname');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const chars = Array.from(e.target.value);
    const isOverMaxLength = chars.length > MAX_NICKNAME_LENGTH;
    const nextValue = chars.slice(0, MAX_NICKNAME_LENGTH).join('');

    e.target.value = nextValue;
    registerOnChange(e);

    if (isOverMaxLength) {
      setValue('nickname', nextValue, { shouldValidate: false });
      setMaxLengthErrorMessage(`닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요`);
      return;
    }

    setMaxLengthErrorMessage(null);
    clearErrors('nickname');
    setValue('nickname', nextValue, { shouldValidate: true });
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(false);
    registerOnBlur(e);
  }

  function onSubmit({ nickname }: NicknameFormValues) {
    onNext(nickname);
  }

  const inputStatus = isError ? 'negative' : isFocused ? 'active' : charCount > 0 ? 'positive' : 'normal';

  return (
    <main className="flex min-h-screen flex-col bg-gradient-bg">
      <PageHeader variant="back" onBack={() => navigate(-1)} />

      <section className="flex flex-1 flex-col gap-7 px-4 pt-5">
        <div className="flex flex-col gap-2">
          <H1 as="h1" className="text-black">
            어떤 이름으로 메세지를 남길까요?
          </H1>
          <B1 className="font-medium text-grey-500">생일자에게 보여질 이름을 입력해주세요.</B1>
        </div>

        <form id="nickname-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextInput
            {...registerRest}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            value={nickname}
            status={inputStatus}
            placeholder="이름이나 별명을 입력해주세요"
            autoComplete="off"
            helperText={helperText}
            counter={{ current: charCount, max: MAX_NICKNAME_LENGTH }}
          />
        </form>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-150 px-4 pb-6">
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
      </div>
    </main>
  );
}
