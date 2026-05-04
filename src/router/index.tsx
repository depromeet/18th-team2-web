import { createBrowserRouter } from 'react-router-dom';

import { OnboardingPage } from '@/pages/OnboardingPage';
import HomePage from '@/pages/HomePage';
import PartyInvitationPage from '@/pages/PartyInvitationPage';

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
    path: '/party/:partyId/invitation',
    element: <PartyInvitationPage />,
  },
]);
