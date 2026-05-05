import { Button } from '@/components/ui/Button';
import { B1, T4 } from '@/components/ui/Typography';

export default function RollingPaperCreateSetupPage() {
  return (
    <main className="flex min-h-screen flex-col px-5 pt-35 pb-6">
      <div className="flex flex-col gap-4">
        <T4>롤링페이퍼 만들기</T4>
        <B1 className="text-grey-500">
          롤링페이퍼 생성 화면은 다음 단계에서 이어서 작업할 예정이에요.
        </B1>
      </div>
      <div className="mt-auto">
        <Button variant="secondary" size="full" disabled>
          준비 중
        </Button>
      </div>
    </main>
  );
}
