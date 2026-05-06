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
    const from = (location.state as { from?: string } | null)?.from; //TODO: 초대장에서 파티 진입 -> 초대장 페이지로 되돌아감
    navigate(from ?? ROUTES.home);
  };

  return {
    isExitDialogOpen,
    handleOpenExitDialog,
    handleCancelExit,
    handleConfirmExit,
  };
}
