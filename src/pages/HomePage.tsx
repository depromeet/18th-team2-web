import { Button } from '@/components/ui/Button';
import { MobileLayout } from '@/components/layout/MobileLayout';

function HomePage() {
  return (
    <MobileLayout>
      <main className="flex flex-col gap-4 p-5">
        {/* full size */}
        <Button>텍스트</Button>
        <Button variant="secondary">텍스트</Button>

        {/* inline sizes — primary */}
        <div className="flex items-center gap-3">
          <Button size="lg">텍스트</Button>
          <Button size="md">텍스트</Button>
          <Button size="sm">텍스트</Button>
        </div>

        {/* inline sizes — secondary */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="lg">텍스트</Button>
          <Button variant="secondary" size="md">텍스트</Button>
          <Button variant="secondary" size="sm">텍스트</Button>
        </div>

        {/* icon */}
        <Button leftIcon={<span>💬</span>}>텍스트</Button>
        <Button variant="secondary" leftIcon={<span>💬</span>}>텍스트</Button>

        {/* white */}
        <Button variant="white">텍스트</Button>

        {/* ghost — 흰 텍스트라 파란 배경 위에서 확인 */}
        <div className="rounded-btn-lg bg-blue-500 p-5">
          <Button variant="ghost">텍스트</Button>
        </div>
      </main>
    </MobileLayout>
  );
}

export default HomePage;
