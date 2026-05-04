import rollingPaperBg from '@/assets/images/rolling-paper-bg.png';

export function CakeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 배경 PNG — 하단에 맞춤 */}
      <img
        src={rollingPaperBg}
        alt=""
        aria-hidden
        className="absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2 select-none"
        draggable={false}
      />
    </div>
  );
}
