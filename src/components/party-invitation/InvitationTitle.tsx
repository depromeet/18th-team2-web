interface ParticipantTitleProps {
  hostName: string;
}

export function ParticipantTitle({ hostName }: ParticipantTitleProps) {
  return (
    <h1 className="text-head-1 max-w-full px-4 text-center font-semibold break-words text-grey-900">
      <span className="inline-block max-w-full">{hostName}님의</span>
      <br />
      <span>온라인 생일파티에 초대할게요</span>
    </h1>
  );
}

export function HostTitle() {
  return (
    <h1 className="text-head-1 max-w-full px-4 text-center font-semibold break-words text-grey-900">
      내 온라인 생일파티에
      <br />
      초대할게요
    </h1>
  );
}
