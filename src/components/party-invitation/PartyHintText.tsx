import type { ReactNode } from 'react';

import { B2 } from '@/components/ui/Typography';

interface PartyHintTextProps {
  children: ReactNode;
}

export function PartyHintText({ children }: PartyHintTextProps) {
  return (
    <B2 as="p" className="text-center font-medium text-grey-500">
      {children}
    </B2>
  );
}

export function PartyEntranceHint() {
  return (
    <PartyHintText>
      파티는 시작 <span className="text-blue-600">5분 전</span>부터 입장 가능해요
    </PartyHintText>
  );
}
