import { Button } from '@/components/ui/Button';
import { PARTY_USER, type PartyUserRole } from '@/constants/live-party';
import { ROUTES } from '@/constants/routes';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { LaterWriteRollingPaperDialog } from '@/components/live-party/end/LaterWriteRollingPaperDialog';
import { useLaterWriteDialog } from '@/hooks/live-party/useLaterWriteDialog';
import type { RealtimePartyNextActionResult } from '@/services/live-party';

interface PartyEndButtonProps {
  role: PartyUserRole;
  action?: RealtimePartyNextActionResult | null;
  hostName?: string;
}

export function PartyEndButton({ role, action, hostName }: PartyEndButtonProps) {
  const navigate = useNavigate();
  const { partyId } = useParams<{ partyId: string }>();
  const isActionReady = Boolean(action);
  const rollingPaperId =
    action?.type === 'HOST_ROLLING_PAPER_LIST' ? String(action.partyId) : (partyId ?? '');
  const rollingPaperWriteInviteToken =
    action?.type === 'PARTICIPANT_ROLLING_PAPER_WRITE' ? action.inviteToken : undefined;

  const handleHome = () => navigate(ROUTES.home);
  const handleRollingPaperCheck = () =>
    navigate(generatePath(ROUTES.rollingPaper, { id: rollingPaperId }));

  const { isOpen, handleOpen, handleClose, handleWriteNow, handleWriteLater } = useLaterWriteDialog(
    { inviteToken: rollingPaperWriteInviteToken, hostName },
  );

  if (!isActionReady) {
    return null;
  }

  return (
    <>
      <footer className="z-11 mt-auto flex w-full flex-col gap-3 px-4 pb-[calc(24px+env(safe-area-inset-bottom))] [@media_(max-height:700px)]:gap-2 [@media_(max-height:700px)]:pb-[calc(16px+env(safe-area-inset-bottom))]">
        {role === PARTY_USER.HOST && (
          <>
            <Button variant="white" onClick={handleRollingPaperCheck}>
              롤링페이퍼 보러가기
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
