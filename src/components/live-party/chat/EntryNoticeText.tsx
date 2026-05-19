import { L2 } from '@/components/ui/Typography';

interface EntryNoticeTextProps {
  userName: string;
}

export function EntryNoticeText({ userName }: EntryNoticeTextProps) {
  return (
    <L2 as="p" className="text-grey-200 mb-5 text-center">
      <span className="font-bold">{userName}</span>님이 입장했어요 👋
    </L2>
  );
}
