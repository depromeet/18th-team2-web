import { createBrowserRouter } from 'react-router-dom';

import { OnboardingPage } from '@/pages/OnboardingPage';
import HomePage from '@/pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
]);
