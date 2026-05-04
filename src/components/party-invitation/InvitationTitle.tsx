import { H1 } from '@/components/ui/Typography';

interface ParticipantTitleProps {
  hostName: string;
}

export function ParticipantTitle({ hostName }: ParticipantTitleProps) {
  return (
    <H1 as="h1" className="text-center text-black">
      {hostName}님의
      <br />
      <span className="text-blue-500">초대장</span>이 도착했어요!
    </H1>
  );
}

export function HostTitle() {
  return (
    <H1 as="h1" className="text-center text-black">
      다른 사람에게 보여지는
      <br />내 초대장이에요
    </H1>
  );
}
