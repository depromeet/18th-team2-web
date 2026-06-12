import letterBackImage from '@/assets/images/create-party/letter-back.png';
import letterFrontImage from '@/assets/images/create-party/letter-front.png';

export function StackedInvitationBackdrop() {
  return (
    <>
      <img
        src={letterBackImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[calc(100%_-_136px)] right-0 left-0 z-0 h-[300px] w-full"
      />
      <img
        src={letterFrontImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[calc(100%_-_32px)] right-0 left-0 z-20 h-[220px] w-full"
      />
    </>
  );
}
