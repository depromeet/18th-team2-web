import { useNavigate } from 'react-router-dom';

import { RollingPaperInvitationCard } from '@/components/party-ended/RollingPaperInvitationCard';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { Button } from '@/components/ui/Button';
import { H1, H3 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import { isFuture } from '@/utils/date';
import { buildRollingPaperWritePath } from '@/utils/rollingPaperWrite';

interface PartyEndedViewProps {
  partyId: string;
  inviteToken: string;
  hostName: string;
  writableFrom: Date;
  writableUntil: Date;
}

export function PartyEndedView({
  partyId,
  inviteToken,
  hostName,
  writableFrom,
  writableUntil,
}: PartyEndedViewProps) {
  const navigate = useNavigate();
  const isExpired = !isFuture(writableUntil);

  function handlePrimaryClick() {
    if (isExpired) {
      navigate(ROUTES.home);
    } else {
      navigate(buildRollingPaperWritePath(partyId, inviteToken), {
        state: {
          completeCta: 'home',
          invitePath: window.location.pathname,
          inviteToken,
          hostName,
        },
      });
    }
  }

  return (
    <main className="bg-gradient-bg flex min-h-screen flex-col">
      <section className="flex flex-1 flex-col items-center gap-7 px-4 pt-16">
        {isExpired ? (
          <H1 as="h1" className="w-full text-center tracking-[-0.0044px] text-black">
            아쉽지만 작성이 <span className="text-red-500">마감</span>됐어요.
            <br />
            다음에는 꼭 함께 마음을 남겨보세요.
          </H1>
        ) : (
          <div className="flex w-full flex-col items-center gap-1">
            <H3 as="p" className="text-center font-medium text-black">
              {hostName}님의 파티가 <span className="text-red-500">종료</span>되었어요
            </H3>
            <H1 as="h1" className="text-center tracking-[-0.0002em] text-black">
              롤링페이퍼로 축하를 남겨보세요!
            </H1>
          </div>
        )}

        <RollingPaperInvitationCard
          hostName={hostName}
          writableFrom={writableFrom}
          writableUntil={writableUntil}
          isExpired={isExpired}
        />
      </section>

      <BottomActionBar>
        <Button variant="primary" size="full" onClick={handlePrimaryClick}>
          {isExpired ? '홈으로' : '롤링페이퍼 작성하기'}
        </Button>
      </BottomActionBar>
    </main>
  );
}
