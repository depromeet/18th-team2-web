import { B2, L2 } from '@/components/ui/Typography';

interface ChatItemProps {
  name: string;
  profileImage: string;
  text: string;
}

export function ChatItem({ name, profileImage, text }: ChatItemProps) {
  return (
    <div className="flex items-start gap-3">
      <img src={profileImage} alt={name} className="h-8 w-8 rounded-full object-cover" />
      <div className="flex flex-col">
        <L2 as="p" className="text-white">
          {name}
        </L2>
        <B2 as="p" className="font-normal text-white">
          {text}
        </B2>
      </div>
    </div>
  );
}
