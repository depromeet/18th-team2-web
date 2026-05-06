import { Controller, type ControllerRenderProps, useFormContext } from 'react-hook-form';

import { RollingPaperFormFooter } from '@/components/rolling-paper-write/RollingPaperFormFooter';
import { ToppingSelector } from '@/components/rolling-paper-write/ToppingSelector';
import {
  MAX_MESSAGE_LENGTH,
  type RollingPaperWriteFormValues,
} from '@/components/rolling-paper-write/useRollingPaperWriteForm';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { H1, H3 } from '@/components/ui/Typography';
import { useControlledGraphemeLimitedField } from '@/hooks/useGraphemeLimitedField';
import { useViewportBottomOffset } from '@/hooks/useViewportBottomOffset';
import { getGraphemeLength } from '@/utils/text';

interface RollingPaperMessageFormProps {
  hostName: string;
  onBack: () => void;
  onNext: () => void;
}

export function RollingPaperMessageForm({ hostName, onBack, onNext }: RollingPaperMessageFormProps) {
  const bottomOffset = useViewportBottomOffset();

  const { watch, control, trigger } = useFormContext<RollingPaperWriteFormValues>();

  const message = watch('message') ?? '';
  const toppingType = watch('toppingType');
  const charCount = getGraphemeLength(message);
  const isReady = charCount > 0 && !!toppingType;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await trigger(['message', 'toppingType']);
    if (ok) onNext();
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-bg">
      <PageHeader onBack={onBack} />

      <section className="flex flex-1 flex-col gap-7 px-4 pt-5">
        <H1 as="h1" className="text-black">
          {hostName}님에게
          <br />
          생일 축하 한마디를 남겨요
        </H1>

        <form id="message-form" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-1.5">
              <Controller
                control={control}
                name="message"
                render={({ field }) => <MessageTextarea field={field} />}
              />
            </div>

            <div className="flex flex-col gap-3">
              <H3 as="p" className="font-semibold text-black">
                편지 봉투가 될 토핑을 선택해주세요
              </H3>
              <Controller
                control={control}
                name="toppingType"
                render={({ field: toppingField }) => (
                  <ToppingSelector
                    value={toppingField.value ?? null}
                    onChange={toppingField.onChange}
                  />
                )}
              />
            </div>
          </div>
        </form>
      </section>

      <RollingPaperFormFooter withGradient bottomOffset={bottomOffset}>
        <Button
          type="submit"
          form="message-form"
          variant={isReady ? 'primary' : 'secondary'}
          size="full"
          disabled={!isReady}
          className="disabled:opacity-100"
        >
          다음
        </Button>
      </RollingPaperFormFooter>
    </main>
  );
}

interface MessageTextareaProps {
  field: ControllerRenderProps<RollingPaperWriteFormValues, 'message'>;
}

function MessageTextarea({ field }: MessageTextareaProps) {
  const message = field.value ?? '';
  const charCount = getGraphemeLength(message);
  const { field: limitedField, overLimitMessage } = useControlledGraphemeLimitedField(field, {
    max: MAX_MESSAGE_LENGTH,
    message: `${MAX_MESSAGE_LENGTH}자 이하로 입력해주세요`,
  });

  return (
    <>
      <div className="flex flex-col rounded-[20px] bg-white px-6 py-6">
        <textarea
          {...limitedField}
          rows={6}
          value={message}
          placeholder="태어나줘서 고마워 ♥"
          className="placeholder:text-grey-200 w-full resize-none bg-transparent text-[20px] leading-[1.4] font-semibold text-blue-600 outline-none placeholder:font-semibold"
        />
      </div>
      <div className="flex items-center justify-between gap-2 text-[14px] leading-5">
        {overLimitMessage ? (
          <p className="text-[12px] leading-4 text-red-500">{overLimitMessage}</p>
        ) : (
          <span />
        )}
        <div className="flex gap-0.5">
          <span
            className={`font-medium ${
              charCount > MAX_MESSAGE_LENGTH ? 'text-red-500' : 'text-grey-500'
            }`}
          >
            {charCount}
          </span>
          <span className="text-grey-300 font-normal">/</span>
          <span className="text-grey-300 font-normal">{MAX_MESSAGE_LENGTH}</span>
        </div>
      </div>
    </>
  );
}
