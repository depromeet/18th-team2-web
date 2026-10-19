import { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useLeaveParty } from '@/services/live-party';
import { useDeleteParty } from '@/services/party';

export type PartyExitMode = 'pending' | 'delete' | 'leave';

interface UsePartyExitDialogParams {
  mode: PartyExitMode;
}

export function usePartyExitDialog({ mode }: UsePartyExitDialogParams) {
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { partyId } = useParams<{ partyId: string }>();
  const { mutate: leaveParty } = useLeaveParty();
  const { mutate: deleteParty } = useDeleteParty();

  const handleOpenExitDialog = useCallback(() => {
    setIsExitDialogOpen(true);
  }, []);

  const handleCancelExit = () => {
    setIsExitDialogOpen(false);
  };

  const handleConfirmExit = () => {
    if (mode === 'pending') return;

    const from = (location.state as { from?: string } | null)?.from;

    const doNavigate = () => {
      navigate(from ?? ROUTES.home);
    };

    if (!partyId) {
      setIsExitDialogOpen(false);
      doNavigate();
      return;
    }

    if (mode === 'delete') {
      deleteParty(partyId, {
        onSuccess: () => {
          setIsExitDialogOpen(false);
          navigate(ROUTES.home, { replace: true });
        },
      });
      return;
    }

    setIsExitDialogOpen(false);
    leaveParty({ partyId }, { onSettled: doNavigate });
  };

  return {
    isExitDialogOpen,
    handleOpenExitDialog,
    handleCancelExit,
    handleConfirmExit,
  };
}
