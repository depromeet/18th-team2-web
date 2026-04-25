import { MobileLayout } from '@/components/layout/MobileLayout';
import { H2, L1 } from '@/components/ui/Typography';
import { ArchiveCard } from '@/components/home/ArchiveCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { PartyCard } from '@/components/home/PartyCard';

function HomePage() {
  return (
    <MobileLayout>
      <div className="bg-gradient-bg flex min-h-screen flex-col">
        <HomeHeader />
        <div className="flex flex-col gap-2 px-4">
          <div className="flex flex-col gap-2.25 py-5">
            <H2 className="font-bold">
              오늘은 누구의 생일을
              <br />
              축하해볼까요?
            </H2>
            <L1 className="text-grey-400">축하가 끝난 뒤에는 롤링페이퍼도 함께 보낼 수 있어요</L1>
          </div>
          <PartyCard />
          <ArchiveCard />
        </div>
      </div>
    </MobileLayout>
  );
}

export default HomePage;
