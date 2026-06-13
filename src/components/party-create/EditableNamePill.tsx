import { useEffect, useRef, useState } from 'react';
import PencilColorIcon from '@/assets/images/icons/pencil-color.svg?react';
import PencilMonoIcon from '@/assets/images/icons/pencil-mono.svg?react';
import { HighlightPill } from '@/components/party-create/HighlightPill';
import { HOST_NAME_MAX_LENGTH } from '@/constants/partyCreate';
import { clampHostName } from '@/utils/string';

interface EditableNamePillProps {
  value: string;
  fallbackValue: string;
  onChange: (value: string) => void;
}

export function EditableNamePill({ value, fallbackValue, onChange }: EditableNamePillProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(value);

  useEffect(() => {
    if (!isEditing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  const commitName = () => {
    const nextName = draftName.trim() ? draftName : fallbackValue;
    onChange(clampHostName(nextName));
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setDraftName(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <span className="text-grey-800 text-head-1 inline-flex h-11 max-w-56 items-center gap-1.5 rounded-full bg-white px-3 align-middle font-semibold tracking-[-0.0002em] ring-2 ring-blue-600">
        <PencilColorIcon className="h-[26px] w-[26px] shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          value={draftName}
          size={Math.max(2, Math.min(HOST_NAME_MAX_LENGTH, draftName.length || 2))}
          maxLength={HOST_NAME_MAX_LENGTH}
          aria-label="이름 입력"
          onChange={(event) => setDraftName(clampHostName(event.target.value))}
          onBlur={commitName}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commitName();
            }
            if (event.key === 'Escape') {
              event.preventDefault();
              cancelEditing();
            }
          }}
          className="min-w-8 bg-transparent p-0 outline-none"
        />
      </span>
    );
  }

  return (
    <HighlightPill
      variant="filled"
      icon={<PencilMonoIcon className="h-[26px] w-[26px] shrink-0" aria-hidden="true" />}
      onClick={() => {
        setDraftName(value);
        setIsEditing(true);
      }}
    >
      {value || fallbackValue}
    </HighlightPill>
  );
}
