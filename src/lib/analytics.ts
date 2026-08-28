import { config } from '@/config/env';

type ClarityFunction = ((...args: unknown[]) => void) & {
  q?: unknown[][];
};

declare global {
  interface Window {
    clarity?: ClarityFunction;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const canUseClarity = () => import.meta.env.PROD && Boolean(config.clarityProjectId);
const canUseGA = () => import.meta.env.PROD && Boolean(config.gaMeasurementId);

export const initClarity = () => {
  if (!canUseClarity() || window.clarity) return;

  const clarity: ClarityFunction = (...args: unknown[]) => {
    clarity.q = clarity.q ?? [];
    clarity.q.push(args);
  };
  window.clarity = clarity;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${config.clarityProjectId}`;
  document.head.appendChild(script);
};

export const initGA = () => {
  if (!canUseGA() || window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', config.gaMeasurementId, { send_page_view: false });
};

export const trackPageView = (pagePath: string) => {
  if (!canUseGA() || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
};

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (!canUseGA() || !window.gtag) return;

  window.gtag('event', eventName, params);
};
