import { Outlet, ScrollRestoration } from 'react-router-dom';

export function MobileLayout() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-grey-100 mx-auto flex min-h-screen w-full max-w-150 flex-col border-x bg-white">
        <Outlet />
      </div>
      <ScrollRestoration />
    </div>
  );
}
