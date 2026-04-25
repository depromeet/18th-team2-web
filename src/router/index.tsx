import { createBrowserRouter } from 'react-router-dom';

import ButtonPreviewPage from '@/pages/ButtonPreviewPage';
import HomePage from '@/pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/button-preview',
    element: <ButtonPreviewPage />,
  },
]);
