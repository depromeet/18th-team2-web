import { PARTY_ROLE } from '@/constants/party';
import type { UpcomingParty } from '@/types/home';

/**
 * 예정된 파티 카드에 '링크 복사'(초대 링크 공유)를 노출할지 여부.
 * REALTIME은 참가자·주최자 모두, PAPER_ONLY는 주최자만 (참가자는 공유할 초대 개념이 없음).
 * 종료된 파티는 초대 링크가 불필요하므로 제외.
 * 카드 노출(UpcomingPartyCard)과 공유 핸들러(HomePage)가 같은 규칙을 쓰도록 단일 소스로 둔다.
 */
export function canShareParty(party: UpcomingParty): boolean {
  return !party.isEnded && (party.partyOption === 'REALTIME' || party.role === PARTY_ROLE.HOST);
}
