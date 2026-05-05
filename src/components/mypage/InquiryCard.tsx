import { Caption, H3 } from '@/components/ui/Typography';

interface InquiryCardProps {
  openChatUrl: string;
}

export function InquiryCard({ openChatUrl }: InquiryCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white px-4 py-3">
      <div className="flex flex-col gap-2">
        <H3 className="text-grey-900">1:1 문의</H3>
        <Caption className="text-grey-400 font-medium">
          기타 사항 발생 시
          <br />
          카카오톡 오픈 채팅으로 문의주세요
        </Caption>
      </div>
      <a
        href={openChatUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="rounded-btn-md bg-blue-30 text-body-2 flex h-[46px] w-full items-center justify-center font-semibold text-blue-500"
      >
        카카오 오픈 채팅
      </a>
    </div>
  );
}
