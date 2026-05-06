import { ChatFooter } from './ChatFooter';
import { ChipList } from './ChipList';
import { ChatHeader } from './ChatHeader';
import { ChatList } from './ChatList';
import { useChatBottomSheet } from '@/hooks/live-party/useChatBottomSheet';

const MOCK_MESSAGES = [
  {
    id: 1,
    user: { name: '하파린', profileImage: '/profile1.png' },
    text: '생일 축하해!! 🎉',
  },
  {
    id: 2,
    user: { name: '친구1', profileImage: '/profile2.png' },
    text: '오늘 주인공이다 😎',
  },
  {
    id: 3,
    user: { name: '친구1', profileImage: '/profile2.png' },
    text: '오늘 주인공이다 😎',
  },
  {
    id: 4,
    user: { name: '친구1', profileImage: '/profile2.png' },
    text: '오늘 주인공이다 😎',
  },
  {
    id: 5,
    user: { name: '친구1', profileImage: '/profile2.png' },
    text: '오늘 주인공이다 😎',
  },
];

export function ChatBottomSheet() {
  const { height, handleMouseDown } = useChatBottomSheet();

  return (
    <div
      className="fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-[598px] rounded-t-2xl border-t border-white/10 bg-[#26295D] px-4"
      style={{ height }}
    >
      <div className="flex h-full flex-col">
        <ChatHeader onMouseDown={handleMouseDown} />
        <ChatList messages={MOCK_MESSAGES} />
        <ChipList />
        <ChatFooter />
      </div>
    </div>
  );
}
