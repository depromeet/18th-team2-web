/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module 'swiper/css';
declare module 'swiper/css/pagination';

interface ImportMetaEnv {
  readonly VITE_CLARITY_PROJECT_ID?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
}
