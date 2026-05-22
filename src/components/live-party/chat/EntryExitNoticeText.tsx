import { L2 } from '@/components/ui/Typography';

interface EntryExitNoticeTextProps {
  userName: string;
  type?: 'entry' | 'exit';
}

export function EntryExitNoticeText({ userName, type = 'entry' }: EntryExitNoticeTextProps) {
  return (
    <L2 as="p" className="text-grey-200 mb-5 text-center">
      <span className="font-bold">{userName}</span>
      {type === 'entry' ? '님이 입장했어요 👋' : '님이 퇴장했어요'}
    </L2>
  );
}
