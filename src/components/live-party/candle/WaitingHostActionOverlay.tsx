import { T4 } from '@/components/ui/Typography';

export function WaitingHostActionOverlay() {
  return (
    <div className="z-50 flex h-full w-full flex-col items-center gap-10 backdrop-blur-md">
      <T4>
        주인공의
        <br />
        진행을 기다리고 있어요
      </T4>
      <div className="h-9 w-9 bg-amber-200">임시</div>
    </div>
  );
}
