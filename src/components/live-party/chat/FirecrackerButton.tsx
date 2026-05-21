import FirecrackerFilledIconSvg from '@/assets/images/live-party/firecracker-filled.svg?react';
import FirecrackerLineIconSvg from '@/assets/images/live-party/firecracker-line.svg?react';
import { useFirecrackerStore } from '@/stores/useFirecrackerStore';
import { useState } from 'react';

export function FirecrackerButton() {
  const [active, setActive] = useState(false);

  const fire = useFirecrackerStore((state) => state.fire);

  const handleClick = () => {
    setActive(true);

    fire();

    setTimeout(() => {
      setActive(false);
    }, 300);
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer transition-all duration-150 active:scale-90"
    >
      {active ? (
        <FirecrackerFilledIconSvg className="h-9 w-9" />
      ) : (
        <FirecrackerLineIconSvg className="h-9 w-9" />
      )}
    </button>
  );
}
