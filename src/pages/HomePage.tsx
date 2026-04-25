import { MobileLayout } from '@/components/layout/MobileLayout';
import { H2, L1 } from '@/components/ui/Typography';
import { ArchiveCard } from './home/ArchiveCard';
import { HomeHeader } from './home/HomeHeader';
import { PartyCard } from './home/PartyCard';

function HomePage() {
  return (
    <MobileLayout>
      <div className="flex min-h-screen flex-col bg-gradient-bg">
        <HomeHeader />
        <div className="flex flex-col gap-2 px-4">
          <div className="flex flex-col gap-2.25 py-5">
            <H2>
              오늘은 누구의 생일을
              <br />
              축하해볼까요?
            </H2>
            <L1 className="text-grey-500">축하가 끝난 뒤에는 롤링페이퍼도 함께 보낼 수 있어요</L1>
          </div>
          <PartyCard />
          <ArchiveCard />
        </div>
      </div>
    </MobileLayout>
  );
}

export default HomePage;
