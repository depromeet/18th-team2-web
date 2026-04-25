import { createBrowserRouter } from 'react-router-dom';

import ButtonPreviewPage from '@/pages/ButtonPreviewPage';
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
  {
    path: '/button-preview',
    element: <ButtonPreviewPage />,
  },
]);
