import { PARTY_ROLE } from '@/constants/party';
import type { UpcomingParty } from '@/types/home';

/**
 * 예정된 파티 카드에 공유 버튼을 노출할지 여부.
 * REALTIME은 참가자·주최자 모두, PAPER_ONLY는 주최자만 (참가자는 공유할 초대 개념이 없음).
 * 라이브 종료 후에는 주최자만 롤링페이퍼 공유가 가능하다.
 * 카드 노출(UpcomingPartyCard)과 공유 핸들러(HomePage)가 같은 규칙을 쓰도록 단일 소스로 둔다.
 */
export function canShareParty(party: UpcomingParty): boolean {
  if (party.isEnded) {
    return party.partyOption === 'REALTIME' && party.role === PARTY_ROLE.HOST;
  }

  return party.partyOption === 'REALTIME' || party.role === PARTY_ROLE.HOST;
}
