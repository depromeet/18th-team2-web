import { useEffect, useState } from 'react';

import { Caption } from '@/components/ui/Typography';
import { config } from '@/config/env';
import { CHARACTER_LABEL_MAP } from '@/constants/character';
import { useCharacters } from '@/services/character';

interface CharacterSelectProps {
  onSelect?: (characterId: number) => void;
}

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${config.apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export function CharacterSelect({ onSelect }: CharacterSelectProps) {
  const { data: characters = [], isLoading } = useCharacters();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (characters.length > 0 && selectedId === null) {
      const firstId = characters[0].characterId ?? null;
      setSelectedId(firstId);
      if (firstId != null) onSelect?.(firstId);
    }
  }, [characters, selectedId, onSelect]);

  const handleSelect = (characterId: number) => {
    setSelectedId(characterId);
    onSelect?.(characterId);
  };

  const selectedCharacter = characters.find((c) => c.characterId === selectedId);
  const selectedImageUrl = resolveImageUrl(selectedCharacter?.characterImageUrl);

  if (isLoading) {
    return <div className="bg-grey-100 h-[174px] w-full animate-pulse rounded-lg" />;
  }

  return (
    <>
      <figure className="h-14 w-full">
        <ul className="flex h-full items-center justify-center gap-4">
          {characters.map((character) => {
            const id = character.characterId;
            if (id == null) return null;
            const isSelected = selectedId === id;
            const thumbnailUrl = resolveImageUrl(character.characterThumbnailImageUrl);

            return (
              <li
                key={id}
                className="flex cursor-pointer flex-col items-center gap-1"
                onClick={() => handleSelect(id)}
              >
                <div
                  className={`rounded-full border-2 ${isSelected ? 'border-blue-600' : 'border-white'}`}
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={character.name ?? '캐릭터'}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="bg-grey-100 h-8 w-8 rounded-full" />
                  )}
                </div>
                <Caption
                  as="p"
                  className={`font-semibold ${isSelected ? 'text-blue-600' : 'text-grey-500'}`}
                >
                  {CHARACTER_LABEL_MAP[id] ?? character.name}
                </Caption>
              </li>
            );
          })}
        </ul>
      </figure>
      <figure className="h-[160px] w-[160px]">
        {selectedImageUrl ? (
          <img
            src={selectedImageUrl}
            alt={selectedCharacter?.name ?? '캐릭터'}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="bg-grey-100 h-full w-full rounded-lg" />
        )}
      </figure>
    </>
  );
}
