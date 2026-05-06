import { useState } from 'react';

import { Controller, type ControllerRenderProps, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { RollingPaperFormFooter } from '@/components/rolling-paper-write/RollingPaperFormFooter';
import {
  MAX_NICKNAME_LENGTH,
  type RollingPaperWriteFormValues,
} from '@/components/rolling-paper-write/useRollingPaperWriteForm';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { TextInput } from '@/components/ui/TextInput';
import { B1, H1 } from '@/components/ui/Typography';
import { useControlledGraphemeLimitedField } from '@/hooks/useGraphemeLimitedField';
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

interface NicknameInputProps {
  field: ControllerRenderProps<RollingPaperWriteFormValues, 'nickname'>;
  isFocused: boolean;
  errorMessage?: string;
  onFocus: () => void;
  onBlur: () => void;
}

function NicknameInput({ field, isFocused, errorMessage, onFocus, onBlur }: NicknameInputProps) {
  const nickname = field.value ?? '';
  const charCount = getGraphemeLength(nickname);
  const { field: limitedField, overLimitMessage } = useControlledGraphemeLimitedField(field, {
    max: MAX_NICKNAME_LENGTH,
    message: `닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요`,
  });
  const helperText = overLimitMessage ?? errorMessage;
  const isError = !!helperText;
  const inputStatus = isError ? 'negative' : isFocused ? 'active' : charCount > 0 ? 'positive' : 'normal';

  return (
    <TextInput
      {...limitedField}
      value={nickname}
      onFocus={onFocus}
      onBlur={() => {
        onBlur();
        limitedField.onBlur();
      }}
      status={inputStatus}
      placeholder="이름이나 별명을 입력해주세요"
      autoComplete="off"
      helperText={helperText}
      counter={{ current: charCount, max: MAX_NICKNAME_LENGTH }}
    />
  );
}
