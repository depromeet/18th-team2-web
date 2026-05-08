import { useState } from 'react';

import { Caption } from '@/components/ui/Typography';
import { CHARACTERS, type CharacterType } from '@/constants/party-enter';

export function CharacterSelect() {
  const [selected, setSelected] = useState<CharacterType>('default');

  const { Character: SelectedCharacter } = CHARACTERS.find((c) => c.type === selected)!;

  return (
    <>
      <figure className="h-14 w-full">
        <ul className="flex h-full items-center justify-center gap-4">
          {CHARACTERS.map(({ type, label, Thumbnail }) => {
            const isSelected = selected === type;
            return (
              <li
                key={type}
                className="flex cursor-pointer flex-col items-center gap-1"
                onClick={() => setSelected(type)}
              >
                <div
                  className={`rounded-full border-2 p-0.5 ${isSelected ? 'border-blue-600' : 'border-transparent'}`}
                >
                  <Thumbnail className="h-8 w-8" />
                </div>
                <Caption className={isSelected ? 'text-blue-600' : 'text-grey-500'}>
                  {label}
                </Caption>
              </li>
            );
          })}
        </ul>
      </figure>
      <figure className="h-[160px] w-[160px]">
        <SelectedCharacter className="h-full w-full" />
      </figure>
    </>
  );
}
