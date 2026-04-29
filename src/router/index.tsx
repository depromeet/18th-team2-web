import { createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import OnboardingPage from '@/pages/OnboardingPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
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
    path: ROUTES.login,
    element: <LoginPage />,
  },
  {
    path: ROUTES.signup,
    element: <SignupPage />,
  },

  // 보호 라우트
  {
    path: ROUTES.home,
    element: (
      <ProtectedRoute>
        <HomePage />
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
