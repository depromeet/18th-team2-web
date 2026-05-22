import { useNavigate } from 'react-router-dom';

import { ErrorView } from '@/components/ui/ErrorView';
import { ROUTES } from '@/constants/routes';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorView
      variant="notFound"
      onPrimaryClick={() => navigate(ROUTES.home, { replace: true })}
    />
  );
}
