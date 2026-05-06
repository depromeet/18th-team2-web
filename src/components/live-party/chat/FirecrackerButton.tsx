import { FirecrackerFilledIcon } from '@/components/ui/icons/FirecrackerFilledIcon';
import { FirecrackerLineIcon } from '@/components/ui/icons/FirecrackerLineIcon';
import { useState } from 'react';

export function FirecrackerButton() {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(true);

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
        <FirecrackerFilledIcon className="h-9 w-9" />
      ) : (
        <FirecrackerLineIcon className="h-9 w-9" />
      )}
    </button>
  );
}
