import { Controller, useFormContext } from 'react-hook-form';

import { MessageTextarea } from '@/components/rolling-paper-write/MessageTextarea';
import { RollingPaperFormFooter } from '@/components/rolling-paper-write/RollingPaperFormFooter';
import { ToppingSelector } from '@/components/rolling-paper-write/ToppingSelector';
import { type RollingPaperWriteFormValues } from '@/components/rolling-paper-write/useRollingPaperWriteForm';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { H1, H3 } from '@/components/ui/Typography';
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
