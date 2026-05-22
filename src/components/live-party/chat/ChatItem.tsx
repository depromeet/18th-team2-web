import { B2, L2 } from '@/components/ui/Typography';

import StarIconSvg from '@/assets/images/live-party/star.svg?react';
import PartyHatSvg from '@/assets/images/live-party/party-hat.svg?react';

interface ChatItemProps {
  name: string;
  profileImage: string;
  text: string;
  senderRole: 'PARTICIPANT' | 'CELEBRANT';
}

export function ChatItem({ name, profileImage, text, senderRole }: ChatItemProps) {
  const isCelebrant = senderRole === 'CELEBRANT';

  return (
    <div className="flex items-start gap-3">
      <div className="relative shrink-0">
        <div
          className={`rounded-full p-[2px] ${
            isCelebrant ? 'bg-linear-to-b from-[#E8B55D] to-[#F0409B]' : 'bg-white'
          }`}
        >
          <img src={profileImage} alt={name} className="h-8 w-8 rounded-full object-cover" />
        </div>

        {isCelebrant && (
          <PartyHatSvg className="absolute top-0 right-0 z-10 w-5 translate-x-[35%] -translate-y-[50%] rotate-30" />
        )}
      </div>

      <div className="flex flex-col">
        <span className="flex items-center gap-1">
          <L2 as="p" className={isCelebrant ? 'text-yellow-300' : 'text-white'}>
            {name}
          </L2>

          {isCelebrant && <StarIconSvg />}
        </span>

        <B2 as="p" className="font-normal text-white">
          {text}
        </B2>
      </div>
    </div>
  );
}
