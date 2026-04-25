import iconChat from '@/assets/icons/icon-chat.svg';

import { Button } from '@/components/ui/Button';
import { MobileLayout } from '@/components/layout/MobileLayout';

export default function ButtonPreviewPage() {
  return (
    <MobileLayout>
      <main className="flex flex-col gap-6 p-5">
        {/* full — primary / secondary */}
        <section className="flex flex-col gap-3">
          <p className="text-caption-1 text-grey-400">full size</p>
          <Button>텍스트</Button>
          <Button variant="secondary">텍스트</Button>
        </section>

        {/* inline sizes — primary */}
        <section className="flex flex-col gap-3">
          <p className="text-caption-1 text-grey-400">inline — primary</p>
          <div className="flex items-center gap-3">
            <Button size="lg">텍스트</Button>
            <Button size="md">텍스트</Button>
            <Button size="sm">텍스트</Button>
          </div>
        </section>

        {/* inline sizes — secondary */}
        <section className="flex flex-col gap-3">
          <p className="text-caption-1 text-grey-400">inline — secondary</p>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="lg">텍스트</Button>
            <Button variant="secondary" size="md">텍스트</Button>
            <Button variant="secondary" size="sm">텍스트</Button>
          </div>
        </section>

        {/* icon */}
        <section className="flex flex-col gap-3">
          <p className="text-caption-1 text-grey-400">with icon</p>
          <Button leftIcon={<img src={iconChat} alt="" width={24} height={24} />}>텍스트</Button>
          <Button variant="secondary" leftIcon={<img src={iconChat} alt="" width={24} height={24} />}>텍스트</Button>
        </section>

        {/* white */}
        <section className="flex flex-col gap-3">
          <p className="text-caption-1 text-grey-400">white</p>
          <Button variant="white">텍스트</Button>
        </section>

        {/* ghost — 흰 텍스트이므로 파란 배경 위에서 확인 */}
        <section className="flex flex-col gap-3">
          <p className="text-caption-1 text-grey-400">ghost (파란 배경 위)</p>
          <div className="rounded-btn-lg bg-blue-500 p-5">
            <Button variant="ghost">텍스트</Button>
          </div>
        </section>
      </main>
    </MobileLayout>
  );
}
