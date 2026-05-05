import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { H1, H3 } from '@/components/ui/Typography';
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
  hostName: string;
  onNext: (message: string, toppingType: ToppingType) => void;
}

export function RollingPaperMessageForm({ hostName, onNext }: RollingPaperMessageFormProps) {
  const navigate = useNavigate();
  const [bottomOffset, setBottomOffset] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
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
    <main className="flex min-h-screen flex-col bg-white">
      <PageHeader variant="back" onBack={() => navigate(-1)} />

      <section className="flex flex-1 flex-col gap-7 px-4 pt-5">
        {/* 타이틀 */}
        <H1 as="h1" className="text-black">
          {hostName}님에게
          <br />
          생일 축하 한마디를 남겨요
        </H1>

        <form id="message-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-7">
            {/* 메시지 textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-col rounded-[20px] border border-grey-100 px-6 py-6">
                <textarea
                  {...messageRegisterRest}
                  ref={(el) => {
                    registerRef(el);
                    textareaRef.current = el;
                  }}
                  maxLength={MAX_MESSAGE_LENGTH}
                  rows={6}
                  placeholder="태어나줘서 고마워 ♥️"
                  className="w-full resize-none bg-transparent text-[20px] font-semibold leading-[1.4] text-blue-600 outline-none placeholder:font-semibold placeholder:text-grey-200"
                />
              </div>
              {/* 글자 수 카운터 */}
              <div className="flex justify-start gap-0.5 text-[14px] leading-5">
                <span className={`font-medium ${charCount >= MAX_MESSAGE_LENGTH ? 'text-red-500' : 'text-grey-500'}`}>
                  {charCount}
                </span>
                <span className="font-normal text-grey-300">/</span>
                <span className="font-normal text-grey-300">{MAX_MESSAGE_LENGTH}</span>
              </div>
            </div>

            {/* 토핑(편지 봉투) 선택 */}
            <div className="flex flex-col gap-3">
              <H3 as="p" className="font-semibold text-black">
                편지 봉투가 될 토핑을 선택해주세요
              </H3>
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
          variant={isReady ? 'primary' : 'secondary'}
          size="full"
          disabled={!isReady}
        >
          다음
        </Button>
      </div>
    </main>
  );
}
