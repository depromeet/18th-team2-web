import { Button } from '@/components/ui/Button';
import { PARTY_USER, type PartyUserRole } from '@/constants/live-party';
import { ROUTES } from '@/constants/routes';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { LaterWriteRollingPaperDialog } from '@/components/live-party/end/LaterWriteRollingPaperDialog';
import { useLaterWriteDialog } from '@/hooks/live-party/useLaterWriteDialog';

interface PartyEndButtonProps {
  role: PartyUserRole;
}

export function PartyEndButton({ role }: PartyEndButtonProps) {
  const navigate = useNavigate();
  const { partyId } = useParams<{ partyId: string }>();

  const handleHome = () => navigate(ROUTES.home);
  const handleRollingPaperCheck = () =>
    navigate(generatePath(ROUTES.rollingPaper, { id: partyId ?? '' }));

  const { isOpen, handleOpen, handleClose, handleWriteNow, handleWriteLater } =
    useLaterWriteDialog();

  return (
    <>
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
            <Button variant="white" onClick={handleWriteNow}>
              롤링페이퍼 남기러 가기
            </Button>
            <Button variant="link-white" onClick={handleOpen}>
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
      <LaterWriteRollingPaperDialog
        isOpen={isOpen}
        onClose={handleClose}
        onCancel={handleWriteNow}
        onConfirm={handleWriteLater}
      />
    </>
  );
}
