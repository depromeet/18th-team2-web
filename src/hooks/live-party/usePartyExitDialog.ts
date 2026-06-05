import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useLeaveParty } from '@/services/live-party';
import { useParticipantStore } from '@/stores/useParticipantStore';

export function usePartyExitDialog() {
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { partyId } = useParams<{ partyId: string }>();
  const { mutate: leaveParty } = useLeaveParty();
  const { participantToken, clearParticipantToken } = useParticipantStore();

  const handleOpenExitDialog = () => {
    setIsExitDialogOpen(true);
  };

  const handleCancelExit = () => {
    setIsExitDialogOpen(false);
  };

  const handleConfirmExit = () => {
    setIsExitDialogOpen(false);

    const from = (location.state as { from?: string } | null)?.from;

    const doNavigate = () => {
      clearParticipantToken();
      navigate(from ?? ROUTES.home);
    };

    if (partyId) {
      leaveParty({ partyId, participantToken }, { onSettled: doNavigate });
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
