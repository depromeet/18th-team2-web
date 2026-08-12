import { Outlet, ScrollRestoration } from 'react-router-dom';

export function MobileLayout() {
  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-150 flex-col bg-white">
        <Outlet />
      </div>
      <ScrollRestoration />
    </div>
  );
}
