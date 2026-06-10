import { useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

interface UseLaterWriteDialogParams {
  inviteToken?: string;
  hostName?: string;
}

export function useLaterWriteDialog({ inviteToken, hostName }: UseLaterWriteDialogParams = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { partyId } = useParams<{ partyId: string }>();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleWriteNow = () => {
    setIsOpen(false);
    if (!partyId) return;

    navigate(generatePath(ROUTES.rollingPaperWrite, { partyId }), {
      state: {
        completeCta: 'home',
        inviteToken,
        hostName,
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
