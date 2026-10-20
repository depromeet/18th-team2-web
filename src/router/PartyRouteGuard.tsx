import type { ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ErrorView } from '@/components/ui/ErrorView';
import { ROUTES } from '@/constants/routes';

interface PartyRouteState {
  inviteToken?: string;
  nickname?: string;
}

interface PartyRouteGuardProps {
  children: ReactNode;
  requireNickname?: boolean;
}

export function PartyRouteGuard({ children, requireNickname = false }: PartyRouteGuardProps) {
  const { partyId } = useParams<{ partyId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PartyRouteState | null;

  const hasRequiredState =
    Boolean(partyId && state?.inviteToken) &&
    (!requireNickname || Boolean(state?.nickname?.trim()));

  if (!hasRequiredState) {
    return (
      <ErrorView
        variant="notFound"
        title="파티에 입장할 수 없어요"
        description={'초대 링크를 통해\n다시 입장해주세요.'}
        primaryLabel="홈으로"
        onPrimaryClick={() => navigate(ROUTES.home, { replace: true })}
      />
    );
  }

  return children;
}
