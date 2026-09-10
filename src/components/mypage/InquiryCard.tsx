import { Caption, H3 } from '@/components/ui/Typography';

interface InquiryCardProps {
  openChatUrl: string;
}

export function InquiryCard({ openChatUrl }: InquiryCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white px-4 py-3">
      <div className="flex flex-col gap-2">
        <H3 className="text-grey-900">서비스 문의</H3>
        <Caption className="text-grey-400 font-medium">
          이용 중 불편한 점이 있으신가요?
          <br />
          아래 문의 폼을 작성해 주시면 바로 확인할게요.
        </Caption>
      </div>
      <a
        href={openChatUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="rounded-btn-md bg-blue-30 text-body-2 flex h-11.5 w-full items-center justify-center font-semibold text-blue-500"
      >
        구글 폼 작성하기
      </a>
    </div>
  );
}
