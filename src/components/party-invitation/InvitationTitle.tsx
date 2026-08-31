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

export function HostTitle({ hostName }: ParticipantTitleProps) {
  return (
    <div className="flex max-w-full flex-col items-center gap-5">
      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-caption-1 font-bold text-blue-600">
        내 초대장
      </span>
      <h1 className="text-head-1 max-w-full px-4 text-center font-semibold break-words text-grey-900">
        <span className="inline-block max-w-full">{hostName}님의</span>
        <br />
        <span>온라인 생일파티에 초대할게요</span>
      </h1>
    </div>
  );
}
