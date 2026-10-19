import { useEffect, useRef, useState } from 'react';
import PencilColorIcon from '@/assets/images/icons/pencil-color.svg?react';
import PencilMonoIcon from '@/assets/images/icons/pencil-mono.svg?react';
import { HighlightPill } from '@/components/party-create/HighlightPill';
import { HOST_NAME_MAX_LENGTH } from '@/constants/partyCreate';
import { clampHostName } from '@/utils/string';

// 이름이 없을 때(비회원) 시간 선택 pill과 같은 형태로 노출하는 안내 문구
export const HOST_NAME_PLACEHOLDER = '이름입력';

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
      <span className="text-grey-800 text-head-2 inline-flex h-10 max-w-56 items-center gap-1.5 rounded-full bg-white px-3 align-middle font-semibold tracking-[-0.0002em] ring-2 ring-blue-600">
        <PencilColorIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="grid min-w-8">
          <span className="invisible col-start-1 row-start-1 whitespace-pre" aria-hidden="true">
            {draftName || HOST_NAME_PLACEHOLDER}
          </span>
          <input
            ref={inputRef}
            value={draftName}
            placeholder={HOST_NAME_PLACEHOLDER}
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
            className="placeholder:text-grey-500 col-start-1 row-start-1 w-full min-w-0 bg-transparent p-0 outline-none"
          />
        </span>
      </span>
    );
  }

  const displayName = value || fallbackValue;

  return (
    <HighlightPill
      variant={displayName ? 'filled' : 'outlined'}
      icon={
        displayName ? (
          <PencilMonoIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
        ) : (
          <PencilColorIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
        )
      }
      onClick={() => {
        setDraftName(value);
        setIsEditing(true);
      }}
    >
      {displayName || HOST_NAME_PLACEHOLDER}
    </HighlightPill>
  );
}
