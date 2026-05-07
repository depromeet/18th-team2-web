export function CakeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 h-[250px] w-[calc(100%+42px)] -translate-x-1/2 rounded-t-[50px] opacity-50"
        style={{
          top: 'calc(var(--rolling-paper-art-offset) + 304px)',
          background:
            'radial-gradient(ellipse at 50% 37%, #6F86FF 0%, #90A3FF 25%, #B2C0FF 50%, #F5FBFF 100%)',
        }}
      />
      <div
        className="absolute left-0 h-[33px] w-full opacity-50"
        style={{
          top: 'calc(var(--rolling-paper-art-offset) + 554px)',
          background:
            'radial-gradient(ellipse at 50% 0%, #405DF3 0%, #7086F6 25%, #A0AEF9 50%, #CFD7FC 75%, #FFFFFF 100%)',
        }}
      />
      <div
        className="absolute left-0 h-6 w-full"
        style={{
          top: 'calc(var(--rolling-paper-art-offset) + 587px)',
          background: 'radial-gradient(ellipse at 50% 50%, #FFFFFF 0%, #DBE3FF 100%)',
        }}
      />
      <div
        className="absolute left-1/2 h-[87px] w-[156%] max-w-[699px] min-w-[585px] -translate-x-1/2"
        style={{
          top: 'calc(var(--rolling-paper-art-offset) + 629px)',
          background:
            'radial-gradient(circle at 28px 44px, #FFFFFF 0 28px, transparent 29px) 0 0 / 57px 87px repeat-x',
        }}
      />
      <div
        className="absolute right-0 bottom-0 left-0 bg-white"
        style={{ top: 'calc(var(--rolling-paper-art-offset) + 671px)' }}
      />
    </div>
  );
}
