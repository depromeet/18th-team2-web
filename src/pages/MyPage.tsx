import { MobileLayout } from '@/components/layout/MobileLayout';

export function MyPage() {
  return (
    <MobileLayout>
      <div className="flex min-h-dvh flex-col items-center justify-center px-5">
        <h1 className="text-t2 font-bold">마이페이지</h1>
        <p className="text-grey-300 mt-2 text-b2">마이페이지 (디자인 확정 후 구현 예정)</p>
      </div>
    </MobileLayout>
  );
}
