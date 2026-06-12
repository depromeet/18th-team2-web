import letterBackImage from '@/assets/images/create-party/letter-back.png';
import letterFrontImage from '@/assets/images/create-party/letter-front.png';

export function StackedInvitationBackdrop() {
  return (
    <>
      <img
        src={letterBackImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 left-0 z-0 h-[300px] w-full"
        style={{ top: 'calc(100% - 136px)' }}
      />
      <img
        src={letterFrontImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 left-0 z-20 h-[220px] w-full"
        style={{ top: 'calc(100% - 32px)' }}
      />
    </>
  );
}
