import { createBrowserRouter } from 'react-router-dom';

import { MobileLayout } from '@/components/layout/MobileLayout';
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
import ArchivePartyDetailPage from '@/pages/ArchivePartyDetailPage';
import ArchivePaperDetailPage from '@/pages/ArchivePaperDetailPage';
import RollingPaperPage from '@/pages/RollingPaperPage';
import MyPage from '@/pages/MyPage';
import PartyInviteEntryPage from '@/pages/PartyInviteEntryPage';

export const router = createBrowserRouter([
  {
    element: <MobileLayout />,
    children: [
      // 공개 라우트
      { path: ROUTES.onboarding, element: <OnboardingPage /> },
      { path: ROUTES.oauthRedirect, element: <OAuthCallbackPage /> },

      // 공개 (비회원/회원 모두 접근, 내부 조건부 렌더링)
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.createParty, element: <PartyTypePage /> },
      { path: ROUTES.partyInvite, element: <PartyInviteEntryPage /> },

      // 보호 라우트
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.createPartyIntro, element: <PartyCreateIntroPage /> },
          { path: ROUTES.createPartyTime, element: <PartyTimeSelectPage /> },
          { path: ROUTES.createPartyCharacter, element: <PartyCharacterSelectPage /> },
          { path: ROUTES.createPartyComplete, element: <PartyCreateCompletePage /> },
          { path: ROUTES.archive, element: <ArchivePage /> },
          { path: ROUTES.archivePartyDetail, element: <ArchivePartyDetailPage /> },
          { path: ROUTES.archivePaperDetail, element: <ArchivePaperDetailPage /> },
          { path: ROUTES.rollingPaper, element: <RollingPaperPage /> },
          { path: ROUTES.mypage, element: <MyPage /> },
        ],
      },
    ],
  },
]);
