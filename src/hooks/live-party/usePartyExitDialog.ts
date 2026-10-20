import { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useLeaveParty } from '@/services/live-party';

interface UsePartyExitDialogOptions {
  onBeforeExit?: () => void;
}

export function usePartyExitDialog({ onBeforeExit }: UsePartyExitDialogOptions = {}) {
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { partyId } = useParams<{ partyId: string }>();
  const { mutate: leaveParty } = useLeaveParty();

  const handleOpenExitDialog = useCallback(() => {
    setIsExitDialogOpen(true);
  }, []);

  const handleCancelExit = () => {
    setIsExitDialogOpen(false);
  };

  const handleConfirmExit = () => {
    setIsExitDialogOpen(false);
    onBeforeExit?.();

    const from = (location.state as { from?: string } | null)?.from;

    const doNavigate = () => {
      navigate(from ?? ROUTES.home);
    };

    if (partyId) {
      leaveParty({ partyId }, { onSettled: doNavigate });
    } else {
      doNavigate();
    }
  };

  return {
    isExitDialogOpen,
    handleOpenExitDialog,
    handleCancelExit,
    handleConfirmExit,
  };
}
