import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

export function usePartyExitDialog() {
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenExitDialog = () => {
    setIsExitDialogOpen(true);
  };

  const handleCancelExit = () => {
    setIsExitDialogOpen(false);
  };

  const handleConfirmExit = () => {
    setIsExitDialogOpen(false);

    const from = (location.state as { from?: string } | null)?.from;

    navigate(from ?? ROUTES.home);
  };

  return {
    isExitDialogOpen,
    handleOpenExitDialog,
    handleCancelExit,
    handleConfirmExit,
  };
}
