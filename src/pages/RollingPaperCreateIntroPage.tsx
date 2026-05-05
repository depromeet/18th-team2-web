import { CreateIntroScreen } from '@/components/party-create/CreateIntroScreen';
import { ROUTES } from '@/constants/routes';

export default function RollingPaperCreateIntroPage() {
  return (
    <CreateIntroScreen
      title="내 롤링페이퍼를 만들게요!"
      nextRoute={ROUTES.createRollingPaperSetup}
    />
  );
}
