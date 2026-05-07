import { useEffect, useRef, useState } from 'react';
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
        className="text-head-1 text-grey-800 inline-flex h-11 max-w-56 min-w-18 rounded-full border-2 border-blue-600 bg-white px-5 font-semibold tracking-[-0.0002em] outline-none"
      />
    );
  }

  return (
    <HighlightPill
      variant="filled"
      onClick={() => {
        setDraftName(value);
        setIsEditing(true);
      }}
    >
      {value || fallbackValue}
    </HighlightPill>
  );
}
