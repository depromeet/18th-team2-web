import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { buildRollingPaperWritePath } from '@/utils/rollingPaperWrite';

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

    navigate(buildRollingPaperWritePath(partyId, inviteToken), {
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
