import { createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import OnboardingPage from '@/pages/OnboardingPage';
import HomePage from '@/pages/HomePage';
import OAuthCallbackPage from '@/pages/OAuthCallbackPage';
import PartyTypePage from '@/pages/PartyTypePage';
import PartyCreateIntroPage from '@/pages/PartyCreateIntroPage';
import PartyTimeSelectPage from '@/pages/PartyTimeSelectPage';
import ArchivePage from '@/pages/ArchivePage';
import RollingPaperPage from '@/pages/RollingPaperPage';
import MyPage from '@/pages/MyPage';

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
    // TODO: BE CORS 해결 후 ProtectedRoute 다시 적용 (회원 전용)
    path: ROUTES.createPartyIntro,
    element: <PartyCreateIntroPage />,
  },
  {
    // TODO: BE CORS 해결 후 ProtectedRoute 다시 적용 (회원 전용)
    path: ROUTES.createPartyTime,
    element: <PartyTimeSelectPage />,
  },

  // 보호 라우트
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
