import { useState } from 'react';
import { generatePath } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useActivateInviteLink } from '@/services/party-create';

export function useRollingPaperShare(partyId: string | undefined) {
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [inviteShareLink, setInviteShareLink] = useState<string | null>(null);
  const { mutate: activateInviteLink, isPending: isActivatingInvite } = useActivateInviteLink();

  function openShareSheet() {
    if (inviteShareLink) {
      setIsShareSheetOpen(true);
      return;
    }
    if (!partyId) return;

    activateInviteLink(Number(partyId), {
      onSuccess: (response) => {
        const token = response.data?.token;
        if (!token) return;

        setInviteShareLink(
          `${window.location.origin}${generatePath(ROUTES.partyInvite, { inviteToken: token })}`,
        );
        setIsShareSheetOpen(true);
      },
    });
  }

  return {
    isShareSheetOpen,
    inviteShareLink,
    isActivatingInvite,
    openShareSheet,
    closeShareSheet: () => setIsShareSheetOpen(false),
  };
}
