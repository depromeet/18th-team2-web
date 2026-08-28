import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';

import { ApiError } from '@/services/api';
import { initClarity, initGA, trackPageView } from '@/lib/analytics';
import { router } from '@/router';
import App from './App';
import './index.css';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 0.2,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.MODE,
  enabled: import.meta.env.MODE === 'production',
});

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (error instanceof ApiError && error.status < 500) return;

      Sentry.captureException(error, {
        tags: { queryKey: JSON.stringify(query.queryKey) },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, _mutation) => {
      if (error instanceof ApiError && error.status < 500) return;

      Sentry.captureException(error);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      // 4xx 클라이언트 에러는 재시도 하지 않음
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 1;
      },
    },
  },
});

initClarity();
initGA();

let lastTrackedPath = '';
const getAnalyticsLocation = () => {
  const { origin } = window.location;
  const { pathname } = router.state.location;

  return {
    pagePath: pathname,
    pageLocation: `${origin}${pathname}`,
  };
};

const trackCurrentPage = () => {
  const { pagePath, pageLocation } = getAnalyticsLocation();

  if (pagePath === lastTrackedPath) return;

  lastTrackedPath = pagePath;
  trackPageView(pagePath, pageLocation);
};

trackCurrentPage();
router.subscribe(trackCurrentPage);

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
