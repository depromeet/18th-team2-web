import { Button } from '@/components/ui/Button';
import { PARTY_USER, type PartyUserRole } from '@/constants/live-party';
import { ROUTES } from '@/constants/routes';
import { useNavigate, useParams } from 'react-router-dom';

interface PartyEndButtonProps {
  role: PartyUserRole;
}

export function PartyEndButton({ role }: PartyEndButtonProps) {
  const navigate = useNavigate();
  const { partyId } = useParams<{ partyId: string }>();

  const handleHome = () => navigate(ROUTES.home);

  const handleRollingPaperCheck = () => navigate(ROUTES.rollingPaper.replace(':id', partyId ?? ''));
  {
    /* TODO: partyId와 라우트로 지정해둔 id가 일치하는지 확인 */
  }

  const handleRollingPaperWrite = () =>
    navigate(ROUTES.rollingPaperWrite.replace(':partyId', partyId ?? ''));

  return (
    <footer className="z-11 mt-auto flex w-full flex-col gap-3 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {role === PARTY_USER.HOST && (
        <>
          <Button variant="white" onClick={handleRollingPaperCheck}>
            롤링페이퍼 확인하러 가기
          </Button>
          <Button variant="link-white" onClick={handleHome}>
            홈으로
          </Button>
        </>
      )}
      {role === PARTY_USER.PARTICIPANT_NOT_WRITTEN && (
        <>
          <Button variant="white" onClick={handleRollingPaperWrite}>
            롤링페이퍼 남기러 가기
          </Button>
          <Button variant="link-white" onClick={handleHome}>
            나중에 남기기
          </Button>
        </>
      )}
      {role === PARTY_USER.PARTICIPANT_WRITTEN && (
        <Button variant="white" onClick={handleHome}>
          홈으로
        </Button>
      )}
    </footer>
  );
}
