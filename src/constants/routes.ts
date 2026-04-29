export const ROUTES = {
  home: '/',
  onboarding: '/onboarding',
  login: '/login',
  signup: '/signup',
  archive: '/archive',
  rollingPaper: (id: string) => `/rolling-paper/${id}`,
  mypage: '/mypage',
} as const;
