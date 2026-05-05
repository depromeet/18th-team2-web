import { CreateIntroScreen } from '@/components/party-create/CreateIntroScreen';
import { ROUTES } from '@/constants/routes';

export default function PartyCreateIntroPage() {
  return <CreateIntroScreen title="파티 만들기를 시작할게요!" nextRoute={ROUTES.createPartyTime} />;
}
