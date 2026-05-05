import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function MessageCardBox({ children }: Props) {
  return <div className="flex h-63 flex-col gap-3 rounded-[20px] bg-white p-6">{children}</div>;
}
