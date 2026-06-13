import { T4 } from '@/components/ui/Typography';

export function WaitingHostActionOverlay() {
  return (
    <div className="absolute inset-0 z-40 flex h-full w-full flex-col items-center justify-center gap-10 backdrop-blur-lg">
      <T4 className="text-center text-white">
        주인공의
        <br />
        진행을 기다리고 있어요
      </T4>

      <div className="h-9 w-9 bg-amber-200">임시</div>
    </div>
  );
}
