import { useParams } from 'react-router-dom';

import { MobileLayout } from '@/components/layout/MobileLayout';

export function RollingPaperPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <MobileLayout>
      <div className="flex min-h-dvh flex-col items-center justify-center px-5">
        <h1 className="text-t2 font-bold">롤링페이퍼</h1>
        <p className="text-grey-300 mt-2 text-b2">롤링페이퍼 #{id} (구현 예정)</p>
      </div>
    </MobileLayout>
  );
}
