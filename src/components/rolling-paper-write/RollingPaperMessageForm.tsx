import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { B2, Caption, H1 } from '@/components/ui/Typography';
import type { ToppingType } from '@/services/rolling-paper';

import { ToppingSelector } from './ToppingSelector';

const MAX_MESSAGE_LENGTH = 100;

const messageSchema = z.object({
  message: z
    .string()
    .min(1, '메시지를 입력해주세요')
    .refine((v) => Array.from(v).length <= MAX_MESSAGE_LENGTH, '100자 이하로 입력해주세요'),
  toppingType: z.enum(['cherry', 'strawberry', 'candle'] as const),
});

type MessageFormValues = z.infer<typeof messageSchema>;

interface RollingPaperMessageFormProps {
  onNext: (message: string, toppingType: ToppingType) => void;
}

export function RollingPaperMessageForm({ onNext }: RollingPaperMessageFormProps) {
  const [bottomOffset, setBottomOffset] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    mode: 'onChange',
  });

  const message = watch('message', '');
  const toppingType = watch('toppingType');
  const charCount = Array.from(message ?? '').length;
  const isReady = charCount > 0 && !!toppingType;

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    function handleResize() {
      const offset = window.innerHeight - (vv?.height ?? window.innerHeight) - (vv?.offsetTop ?? 0);
      setBottomOffset(Math.max(0, offset));
    }

    vv.addEventListener('resize', handleResize);
    return () => vv.removeEventListener('resize', handleResize);
  }, []);

  const { ref: registerRef, ...messageRegisterRest } = register('message');

  function onSubmit({ message, toppingType }: MessageFormValues) {
    onNext(message, toppingType);
  }

  return (
    <main className="bg-gradient-bg flex min-h-screen flex-col">
      <section className="flex flex-1 flex-col gap-6 px-4 pt-16">
        <H1 as="h1" className="text-center tracking-[-0.0002em] text-black">
          마음을 담아
          <br />
          메시지를 남겨보세요
        </H1>

        <form id="message-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-6">
            {/* 메시지 textarea */}
            <div className="flex flex-col gap-2">
              <div
                className={`flex flex-col rounded-btn-md border px-4 py-3.5 ${
                  errors.message ? 'border-red-500' : 'border-grey-100 focus-within:border-blue-500'
                }`}
              >
                <textarea
                  {...messageRegisterRest}
                  ref={(el) => {
                    registerRef(el);
                    textareaRef.current = el;
                  }}
                  maxLength={MAX_MESSAGE_LENGTH}
                  rows={5}
                  placeholder="생일을 축하하는 메시지를 남겨주세요 (최대 100자)"
                  className="w-full resize-none bg-transparent text-body-1 text-black outline-none placeholder:text-grey-300"
                />
                <Caption
                  as="span"
                  className={`self-end ${charCount >= MAX_MESSAGE_LENGTH ? 'text-red-500' : 'text-grey-300'}`}
                >
                  {charCount}/{MAX_MESSAGE_LENGTH}
                </Caption>
              </div>
              {errors.message && (
                <B2 as="p" className="text-red-500">
                  {errors.message.message}
                </B2>
              )}
            </div>

            {/* 토핑(편지지) 선택 */}
            <div className="flex flex-col gap-3">
              <B2 as="p" className="font-medium text-grey-600">
                편지지 선택
              </B2>
              <Controller
                control={control}
                name="toppingType"
                render={({ field }) => (
                  <ToppingSelector
                    value={field.value ?? null}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </form>
      </section>

      <div
        className="fixed inset-x-0 z-10 mx-auto flex w-full max-w-150 items-end px-4 pb-6"
        style={{ bottom: bottomOffset, height: `calc(110px + ${bottomOffset}px)` }}
      >
        <Button
          type="submit"
          form="message-form"
          variant="primary"
          size="full"
          disabled={!isReady}
        >
          다음
        </Button>
      </div>
    </main>
  );
}
