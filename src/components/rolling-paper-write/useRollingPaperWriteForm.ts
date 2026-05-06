import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { ToppingType } from '@/services/rolling-paper';
import { getGraphemeLength } from '@/utils/text';

export const MAX_NICKNAME_LENGTH = 10;
export const MAX_MESSAGE_LENGTH = 100;

const TOPPING_TYPES = ['cherry', 'strawberry', 'candle'] as const satisfies readonly ToppingType[];

export const rollingPaperWriteSchema = z.object({
  nickname: z
    .string()
    .min(1, '닉네임을 입력해주세요')
    .refine(
      (v) => getGraphemeLength(v) <= MAX_NICKNAME_LENGTH,
      `닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요`,
    ),
  message: z
    .string()
    .min(1, '메시지를 입력해주세요')
    .refine(
      (v) => getGraphemeLength(v) <= MAX_MESSAGE_LENGTH,
      `${MAX_MESSAGE_LENGTH}자 이하로 입력해주세요`,
    ),
  toppingType: z.enum(TOPPING_TYPES),
});

export type RollingPaperWriteFormValues = z.infer<typeof rollingPaperWriteSchema>;

export type RollingPaperWriteFormDraft = {
  nickname: string;
  message: string;
  toppingType: ToppingType | undefined;
};

const DEFAULT_DRAFT: RollingPaperWriteFormDraft = {
  nickname: '',
  message: '',
  toppingType: undefined,
};

/**
 * 닉네임/메시지/토핑 작성 단계 전체를 한 폼 인스턴스로 관리합니다.
 * 단계별 부분 검증은 호출부에서 `trigger(fieldNames)`로 수행합니다.
 */
export function useRollingPaperWriteForm() {
  return useForm<RollingPaperWriteFormValues>({
    resolver: zodResolver(rollingPaperWriteSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_DRAFT,
  });
}
