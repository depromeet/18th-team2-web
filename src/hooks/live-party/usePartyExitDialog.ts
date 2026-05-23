import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useLeaveParty } from '@/services/live-party';

const PARTICIPANT_TOKEN_KEY = 'rt-participant-token';

export function usePartyExitDialog() {
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { partyId } = useParams<{ partyId: string }>();
  const { mutate: leaveParty } = useLeaveParty();

  const handleOpenExitDialog = () => {
    setIsExitDialogOpen(true);
  };

  const handleCancelExit = () => {
    setIsExitDialogOpen(false);
  };

  const handleConfirmExit = () => {
    setIsExitDialogOpen(false);

    const from = (location.state as { from?: string } | null)?.from;
    const participantToken = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);

    const doNavigate = () => {
      sessionStorage.removeItem(PARTICIPANT_TOKEN_KEY);
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
