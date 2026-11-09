import { useState } from 'react';

import CloseIcon from '@/assets/images/icons/close.svg?react';
import PartyPopperIcon from '@/assets/images/icons/party-popper.svg?react';

export function RollingPaperShareNotice() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(109px+env(safe-area-inset-bottom))] z-40 flex justify-center px-4">
      <div
        role="status"
        className="link-share-toast pointer-events-auto flex h-[76px] w-[343px] max-w-full items-center justify-between rounded-[14px] bg-black/70 p-4 text-white"
      >
        <PartyPopperIcon aria-hidden="true" className="h-10 w-10 shrink-0" />
        <p className="text-body-2 mx-3 flex-1 leading-[22px] font-medium break-keep">
          친구들에게 공유하면
          <br />더 많은 축하를 받을 수 있어요!
        </p>
        <button
          type="button"
          aria-label="공유 안내 닫기"
          onClick={() => setIsOpen(false)}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
