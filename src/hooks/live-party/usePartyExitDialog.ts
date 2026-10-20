import { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useLeaveParty, useStartRealtimeEnd } from '@/services/live-party';
import { useDeleteParty } from '@/services/party';

export type PartyExitMode = 'pending' | 'delete' | 'host-end' | 'leave';

interface UsePartyExitDialogParams {
  mode: PartyExitMode;
  onHostEnd: () => void;
  onBeforeExit?: () => void;
}

export function usePartyExitDialog({ mode, onHostEnd, onBeforeExit }: UsePartyExitDialogParams) {
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { partyId } = useParams<{ partyId: string }>();
  const { mutate: leaveParty } = useLeaveParty();
  const { mutate: startRealtimeEnd } = useStartRealtimeEnd();
  const { mutate: deleteParty } = useDeleteParty();

  const handleOpenExitDialog = useCallback(() => {
    setIsExitDialogOpen(true);
  }, []);

  const handleCancelExit = () => {
    setIsExitDialogOpen(false);
  };

  const handleConfirmExit = () => {
    if (mode === 'pending') return;

    const completeExit = () => {
      setIsExitDialogOpen(false);
      onBeforeExit?.();
    };

    const from = (location.state as { from?: string } | null)?.from;

    const doNavigate = () => {
      navigate(from ?? ROUTES.home);
    };

    if (!partyId) {
      completeExit();
      doNavigate();
      return;
    }

    if (mode === 'delete') {
      deleteParty(partyId, {
        onSuccess: () => {
          completeExit();
          navigate(ROUTES.home, { replace: true });
        },
      });
      return;
    }

    if (mode === 'host-end') {
      startRealtimeEnd(partyId, {
        onSuccess: () => {
          completeExit();
          onHostEnd();
        },
      });
      return;
    }

    completeExit();
    leaveParty({ partyId }, { onSettled: doNavigate });
  };

  return {
    isExitDialogOpen,
    handleOpenExitDialog,
    handleCancelExit,
    handleConfirmExit,
  };
}
