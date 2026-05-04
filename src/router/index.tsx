import { createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import OnboardingPage from '@/pages/OnboardingPage';
import HomePage from '@/pages/HomePage';
import OAuthCallbackPage from '@/pages/OAuthCallbackPage';
import PartyTypePage from '@/pages/PartyTypePage';
import PartyCreateIntroPage from '@/pages/PartyCreateIntroPage';
import PartyTimeSelectPage from '@/pages/PartyTimeSelectPage';
import PartyCharacterSelectPage from '@/pages/PartyCharacterSelectPage';
import PartyCreateCompletePage from '@/pages/PartyCreateCompletePage';
import ArchivePage from '@/pages/ArchivePage';
import RollingPaperPage from '@/pages/RollingPaperPage';
import MyPage from '@/pages/MyPage';
import PartyInvitationPage from '@/pages/PartyInvitationPage';
import PartyEndedPage from '@/pages/PartyEndedPage';

export const router = createBrowserRouter([
  // 공개 라우트
  {
    path: ROUTES.onboarding,
    element: <OnboardingPage />,
  },
  {
    path: ROUTES.oauthCallback,
    element: <OAuthCallbackPage />,
  },

  // 공개 (비회원/회원 모두 접근, 내부에서 조건부 렌더링)
  {
    path: ROUTES.home,
    element: <HomePage />,
  },
  {
    path: ROUTES.createParty,
    element: <PartyTypePage />,
  },
  {
    path: ROUTES.partyInvitation,
    element: <PartyInvitationPage />,
  },
  {
    path: ROUTES.partyEnded,
    element: <PartyEndedPage />,
  },

  // 보호 라우트
  {
    path: ROUTES.createPartyIntro,
    element: (
      <ProtectedRoute>
        <PartyCreateIntroPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.createPartyTime,
    element: (
      <ProtectedRoute>
        <PartyTimeSelectPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.createPartyCharacter,
    element: (
      <ProtectedRoute>
        <PartyCharacterSelectPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.createPartyComplete,
    element: (
      <ProtectedRoute>
        <PartyCreateCompletePage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.archive,
    element: (
      <ProtectedRoute>
        <ArchivePage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.rollingPaper,
    element: (
      <ProtectedRoute>
        <RollingPaperPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.mypage,
    element: (
      <ProtectedRoute>
        <MyPage />
      </ProtectedRoute>
    ),
  },
]);
