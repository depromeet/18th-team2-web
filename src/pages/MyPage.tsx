import { MobileLayout } from '@/components/layout/MobileLayout';

export default function MyPage() {
  return (
    <MobileLayout>
      <div className="flex min-h-dvh flex-col items-center justify-center px-5">
        <h1 className="text-title-2 font-bold">마이페이지</h1>
        <p className="text-grey-300 mt-2 text-body-2">마이페이지 (디자인 확정 후 구현 예정)</p>
      </div>
    </MobileLayout>
  );
}
