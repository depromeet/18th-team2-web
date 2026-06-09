import { useState } from 'react';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

export function useLaterWriteDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { inviteToken?: string; hostName?: string } | null;
  const { partyId } = useParams<{ partyId: string }>();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleWriteNow = () => {
    setIsOpen(false);
    if (!partyId || !locationState?.inviteToken) return;

    navigate(generatePath(ROUTES.rollingPaperWrite, { partyId }), {
      state: {
        completeCta: 'home',
        inviteToken: locationState.inviteToken,
        hostName: locationState.hostName,
      },
    });
  };

  const handleWriteLater = () => {
    navigate(ROUTES.home);
  };

  return {
    isOpen,
    handleOpen,
    handleClose,
    handleWriteNow,
    handleWriteLater,
  };
}
