import { B2, L2 } from '@/components/ui/Typography';

import PartyHatSvg from '@/assets/images/live-party/party-hat.svg?react';

interface ChatItemProps {
  name: string;
  profileImage: string | null;
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
            isCelebrant && 'bg-linear-to-b from-[#E8B55D] to-[#F0409B]'
          }`}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="h-[30px] w-[30px] rounded-full object-cover"
            />
          ) : (
            <div className="bg-grey-200 h-[30px] w-[30px] rounded-full" />
          )}
        </div>

        {isCelebrant && (
          <PartyHatSvg className="absolute top-0 right-0 z-10 w-5 translate-x-[35%] -translate-y-[50%] rotate-30" />
        )}
      </div>

      <div className="flex flex-col">
        <L2 as="p" className="font-bold text-white">
          {name}
        </L2>
        <B2 as="p" className="font-normal text-white">
          {text}
        </B2>
      </div>
    </div>
  );
}
