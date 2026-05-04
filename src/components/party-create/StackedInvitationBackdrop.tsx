export function StackedInvitationBackdrop() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-0 left-0 z-20 w-full"
      style={{ height: 220, top: 'calc(100% - 32px)' }}
      viewBox="0 0 375 220"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="invitation-backdrop-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B2CDFF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      <path
        d="M 0 0 L 20 12 L 355 12 L 375 0 L 375 220 L 0 220 Z"
        fill="url(#invitation-backdrop-gradient)"
      />
    </svg>
  );
}
