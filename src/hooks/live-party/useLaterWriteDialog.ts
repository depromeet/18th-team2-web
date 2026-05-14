import { useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

export function useLaterWriteDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { partyId } = useParams<{ partyId: string }>();

  const handleOpen = () => setIsOpen(true);

  const handleWriteNow = () => {
    setIsOpen(false);
    if (partyId) navigate(generatePath(ROUTES.rollingPaperWrite, { partyId }));
  };

  const handleWriteLater = () => {
    navigate(ROUTES.home);
  };

  return {
    isOpen,
    handleOpen,
    handleWriteNow,
    handleWriteLater,
  };
}
