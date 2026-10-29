import { generatePath } from 'react-router-dom';

import { PARTY_ROLE } from '@/constants/party';
import { ROUTES } from '@/constants/routes';
import type { UpcomingParty } from '@/types/home';

// 카드 CTA → 이동 경로.
export function getCardRoutePath(party: UpcomingParty): string | null {
  const { role, partyOption, isEnded, partyId, inviteToken } = party;
  const isHost = role === PARTY_ROLE.HOST;

  // 라이브 종료 → 롤링페이퍼 단계: 주최자는 확인, 참가자는 초대장 기반 작성
  if (isEnded) {
    if (isHost) return partyId ? generatePath(ROUTES.rollingPaper, { id: partyId }) : null;
    return inviteToken ? generatePath(ROUTES.partyInvite, { inviteToken }) : null;
  }

  if (partyOption === 'REALTIME') {
    // 참가자·주최자 모두 바로 입장이 아닌 초대장 확인 화면(입장·공유 허브)으로 통일
    return inviteToken ? generatePath(ROUTES.partyInvite, { inviteToken }) : null;
  }

  // PAPER_ONLY — 참가자는 초대장 기반 작성, 주최자는 공개 전에도 작성 현황을 확인한다.
  if (role === PARTY_ROLE.PARTICIPANT) {
    return inviteToken ? generatePath(ROUTES.partyInvite, { inviteToken }) : null;
  }
  return partyId ? generatePath(ROUTES.rollingPaper, { id: partyId }) : null;
}
