interface ArchiveFilterToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

/**
 * 보관함 "내가 만든 파티" 필터 토글 (체크박스 스위치).
 * off: 빈 회색 원(grey-300) + 라벨 grey-800 medium
 * on:  파란 원(blue-500) + 흰 체크 + 라벨 grey-900 semibold
 */
export function ArchiveFilterToggle({
  checked,
  onChange,
  label = '내가 만든 파티',
}: ArchiveFilterToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-0.5 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
    >
      <span className="flex h-[18px] w-[18px] items-center justify-center">
        <span
          className={`flex h-[15px] w-[15px] items-center justify-center rounded-full ${
            checked ? 'bg-blue-500' : 'border-grey-300 border'
          }`}
        >
          {checked && (
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden>
              <path
                d="M1 3L3 5L7 1"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </span>
      <span
        className={`text-label-1 ${checked ? 'text-grey-900 font-semibold' : 'text-grey-800 font-medium'}`}
      >
        {label}
      </span>
    </button>
  );
}
