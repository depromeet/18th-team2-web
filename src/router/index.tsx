import { createBrowserRouter } from 'react-router-dom';

import { OnboardingPage } from '@/pages/OnboardingPage';

export const router = createBrowserRouter([
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
]);
