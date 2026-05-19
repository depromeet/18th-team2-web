import { B2, L2 } from '@/components/ui/Typography';
import StarIconSvg from '@/assets/images/live-party/star.svg?react';
import PartyHatSvg from '@/assets/images/live-party/partyHat.svg?react';

interface ChatItemProps {
  name: string;
  profileImage: string;
  text: string;
  senderRole: 'PARTICIPANT' | 'CELEBRANT';
}

export function ChatItem({ name, profileImage, text, senderRole }: ChatItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative inline-block shrink-0">
        <img src={profileImage} alt={name} className="h-8 w-8 rounded-full object-cover" />
        {senderRole === 'CELEBRANT' && (
          <PartyHatSvg className="absolute top-0 right-0 z-10 w-5 translate-x-[35%] -translate-y-[50%] rotate-25" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="flex">
          <L2
            as="p"
            className={`${senderRole === 'PARTICIPANT' ? 'text-white' : 'text-yellow-300'}`}
          >
            {name}
          </L2>
          {senderRole === 'CELEBRANT' && <StarIconSvg />}
        </span>
        <B2 as="p" className="font-normal text-white">
          {text}
        </B2>
      </div>
    </div>
  );
}
