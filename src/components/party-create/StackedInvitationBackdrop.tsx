import BackdropSvg from '@/assets/images/icons/invitation-backdrop.svg?react';

export function StackedInvitationBackdrop() {
  return (
    <BackdropSvg
      aria-hidden
      className="pointer-events-none absolute right-0 left-0 z-20 w-full"
      style={{ height: 220, top: 'calc(100% - 32px)' }}
      preserveAspectRatio="none"
    />
  );
}
