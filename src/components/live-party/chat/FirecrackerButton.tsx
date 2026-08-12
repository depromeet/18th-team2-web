import { useState } from 'react';
import { useParams } from 'react-router-dom';

import FirecrackerFilledIconSvg from '@/assets/images/live-party/firecracker-filled.svg?react';
import FirecrackerLineIconSvg from '@/assets/images/live-party/firecracker-line.svg?react';
import { useTriggerFireworks } from '@/services/live-party';

export function FirecrackerButton() {
  const [active, setActive] = useState(false);
  const { partyId } = useParams<{ partyId: string }>();
  const { mutate: triggerFireworks } = useTriggerFireworks();

  const handleClick = () => {
    setActive(true);
    setTimeout(() => setActive(false), 300);

    triggerFireworks({ partyId: partyId! });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="shrink-0 cursor-pointer transition-all duration-150 active:scale-90"
    >
      {active ? (
        <FirecrackerFilledIconSvg className="h-9 w-9" />
      ) : (
        <FirecrackerLineIconSvg className="h-9 w-9" />
      )}
    </button>
  );
}
