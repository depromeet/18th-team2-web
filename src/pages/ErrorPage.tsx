import { useNavigate } from 'react-router-dom';

import { ErrorView } from '@/components/ui/ErrorView';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <ErrorView
      variant="retry"
      onPrimaryClick={() => window.location.reload()}
      onSecondaryClick={() => navigate(-1)}
    />
  );
}
