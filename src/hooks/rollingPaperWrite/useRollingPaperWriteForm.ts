import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  MESSAGE_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  VALIDATION_MESSAGES,
} from '@/constants/validation';
import type { ToppingType } from '@/services/rolling-paper';
import { getGraphemeLength } from '@/utils/text';

const TOPPING_TYPES = ['cherry', 'strawberry', 'candle'] as const satisfies readonly ToppingType[];

export const rollingPaperWriteSchema = z.object({
  nickname: z
    .string()
    .min(1, VALIDATION_MESSAGES.nickname.required)
    .refine(
      (v) => getGraphemeLength(v) <= NICKNAME_MAX_LENGTH,
      VALIDATION_MESSAGES.nickname.maxLength,
    ),
  message: z
    .string()
    .min(1, VALIDATION_MESSAGES.message.required)
    .refine(
      (v) => getGraphemeLength(v) <= MESSAGE_MAX_LENGTH,
      VALIDATION_MESSAGES.message.maxLength,
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
