import { T4 } from '@/components/ui/Typography';
import { type PartyUserRole } from '@/constants/live-party';

const PARTY_END_TEXT: Record<PartyUserRole, React.ReactNode> = {
  PARTICIPANT_NOT_WRITTEN: (
    <>
      파티의 마지막을 장식해볼까요?
      <br />
      짧은 축하 메시지를 남겨주세요
    </>
  ),
  PARTICIPANT_WRITTEN: (
    <>
      생일 파티에 참여해 주셔서 감사해요
      <br />
      덕분에 행복한 생일이 되었어요!
    </>
  ),
  HOST: (
    <>
      마지막으로 친구들이 남긴
      <br />
      롤링페이퍼를 보러 갈까요?
    </>
  ),
};

interface PartyEndTextProps {
  role: PartyUserRole;
}

export function PartyEndText({ role }: PartyEndTextProps) {
  return <T4 className="text-center whitespace-pre-line text-white">{PARTY_END_TEXT[role]}</T4>;
}
